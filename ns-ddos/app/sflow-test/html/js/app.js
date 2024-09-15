$(function() { 
  var restPath =  '../scripts/test.js/';
  var agentsPath = restPath+"agents/json";
  var agentPath = restPath+"agent/json";
  var checkPath = restPath+"checks/json";
  var startPath = restPath+"start/json";
  var stopPath = restPath+"stop/json";
  var uploadPath = restPath+"upload/json";

  var lastTest;

  var defaults = {
    tab:0,
    overall0:'show',
    overall1:'hide',
  };

  var state = {};
  $.extend(state,defaults);

  function createQuery(params) {
    var query, key, value;
    for(key in params) {
      value = params[key];
      if(value == defaults[key]) continue;
      if(query) query += '&';
      else query = '';
      query += encodeURIComponent(key)+'='+encodeURIComponent(value);
    }
    return query;
  }

  function getState(key, defVal) {
    return window.sessionStorage.getItem('sflow_test_'+key) || state[key] || defVal;
  }

  function setState(key, val, showQuery) {
    state[key] = val;
    window.sessionStorage.setItem('sflow_test_'+key, val);
    if(showQuery) {
      var query = createQuery(state);
      window.history.replaceState({},'',query ? '?' + query : './');
    }
  }

  function setQueryParams(query) {
    var vars, params, i, pair;
    vars = query.split('&');
    params = {};
    for(i = 0; i < vars.length; i++) {
      pair = vars[i].split('=');
      if(pair.length == 2) setState(decodeURIComponent(pair[0]), decodeURIComponent(pair[1]),false);
    }
  }

  var search = window.location.search;
  if(search) setQueryParams(search.substring(1));

  var dialog = $('#dialog').dialog({
    autoOpen:false,
    modal: true,
    width: '700px',
    buttons: {
      Submit: function() {
        lastTest.vendor = $('#vendor').val();
        lastTest.model = $('#model').val();
        lastTest.firmware = $('#firmware').val();
        lastTest.name = $('#name').val();
        lastTest.email = $('#email').val();
        $.ajax({
          url:uploadPath,
          type: 'POST',
          contentType:'application/json',
          data:JSON.stringify(lastTest)
        });
        dialog.dialog('close');
      },
      Cancel: function() { dialog.dialog('close'); }
    }
  });

  $('#tabs').tabs({
    active: getState('tab', 0),
    activate: function(event, ui) {
      var newIndex = ui.newTab.index();
      setState('tab', newIndex, true);
      $.event.trigger({type:'updateChart'});
    },
    create: function(event,ui) {
      $.event.trigger({type:'updateChart'});
    }
  }); 

  $('#results').hide();

  var db = {};
  $('#bytes').chart({
    type: 'trend',
    metrics: ['bps-flows','bps-counters'],
    legend:['Flows','Counters'],
    stack: false,
    units: 'Bits per Second'},
  db);
  $('#frames').chart({
    type: 'trend',
    metrics: ['pps-flows','pps-counters'],
    legend:['Flows','Counters'],
    stack: false,
    units: 'Packets per Second'},
  db);
  $('#samples').chart({
    type: 'trend',
    metrics: ['sample-rate'],
    stack: false,
    units: 'Samples per Second'},
  db);

  $.get(agentsPath, function(data) {
    $.each(data.agents, function(index,item) {
      $('<option value="'+ item + '">'+item+'</option>').appendTo('#agent');
    });
    if(data.agent) {
      $('#agent').val(data.agent);
      $('#start').button('option','disabled','none' == data.agent);
      $('#end').button('option','disabled',true);
      $('#print').button('option','disabled',true);
      $('#upload').button('option','disabled',true);
    }
    $('#agent').selectmenu({
      change:function() {
        stopPollTestResults();
        var agent = $('#agent').val();
        $.get(agentPath,{'agent':$('#agent').val()});
        $('#results').hide();
        $('#start').button('option','disabled','none'==agent);
        $('#end').button('option','disabled',true);
        $('#print').button('option','disabled',true);
        $('#upload').button('option','disabled',true);
      }
    });
  });

  function updateTests(data) {
    var status = $('#info tbody');
    status.empty();
    if(data && data.tests && data.tests.length > 0) {
      for(var r = 0; r < data.tests.length; r++) {
        var entry = data.tests[r];
        var cl;
        switch(entry.status) {
          case 'wait': cl = 'warn'; break;
          case 'fail': cl = 'error'; break;
          case 'pass': cl = 'good'; break;
          case 'found': cl = 'good'; break;
          case 'notfound': cl = 'warn'; break;
          default: cl = r%2 === 0 ? 'even' : 'odd';
        }
        var row = $('<tr class="'+cl+'"></tr>');
        row.append('<td>'+entry.status+'</td>');
        row.append('<td>'+entry.descr+'</td>');
        row.append('<td>'+ (entry.data ? entry.data : '') + '</td>');
        status.append(row);
      }
    } else {
      status.append('<tr><td colspan="3" class="alignc">No data</td></tr>');
    }
  }

  function updateTrend(data) {
    if(!data 
      || !data.trend 
      || !data.trend.times 
      || data.trend.times.length == 0) return;

    db.trend = data.trend;
    db.trend.start = new Date(db.trend.times[0]);
    db.trend.end = new Date(db.trend.times[db.trend.times.length - 1]);
    $.event.trigger({type:'updateChart'});
  }

  var running_test;
  var timeout_test;
  function pollTestResults() {
    running_test = true;
    $.ajax({
      url: checkPath,
      success: function(data) {
        if(running_test) {
          lastTest = data;
          updateTests(data);
          updateTrend(data);
          timeout_test = setTimeout(pollTestResults, 1000);
        }
      },
      error: function(result,status,errorThrown) {
        if(running_test) timeout_test = setTimeout(pollTestResults, 2000);
      },
      timeout: 60000
    });
  }

  function stopPollTestResults() {
    running_test = false;
    if(timeout_test) clearTimeout(timeout_test);
  }

  $('#start').button({disabled:true}).click(function() {
    $('#agent').selectmenu('option','disabled',true);
    $('#start').button('option','disabled',true);
    $('#end').button('option','disabled',false);
    $('#print').button('option','disabled',true);
    $('#upload').button('option','disabled',true);
    $.ajax({
      url:startPath,
      success:function() {
        $('#results').show();
        pollTestResults();
      }
    });
  });
  $('#end').button({disabled:true}).click(function() {
    $('#agent').selectmenu('option','disabled',false);
    $('#start').button('option','disabled',false);
    $('#end').button('option','disabled',true);
    $('#print').button('option','disabled',false);
    $('#upload').button('option','disabled',false);
    $.ajax({
      url:stopPath,
      success: function() {
        stopPollTestResults();
      }
    });
  });
  $('#print').button({disabled:true}).click(function() { window.print(); });
  $('#upload').button({disabled:true}).click(function() {
    dialog.dialog('open');
  });
});
