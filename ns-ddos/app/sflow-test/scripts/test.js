// author: InMon Corp.
// version: 1.0
// date: 4/12/2018
// description: Test sFlow export from switch/router
// copyright: Copyright (c) 2015-2018 InMon Corp. ALL RIGHTS RESERVED

include(scriptdir() + '/inc/trend.js');

var version = "1.0";

var includeRandomTest = "yes" == getSystemProperty("sflow-test.random");
var submitURL = getSystemProperty("sflow-test.submit") || "https://sflow.org/test/submit.php";

var PASS='pass';
var FAIL='fail';
var WAIT='wait';
var FOUND='found';
var NOTFOUND='notfound';

function testResult(id,descr,status,data) {
  var result = {id:id,descr:descr,status:status};
  if(data) result.data = data;
  return result;
}

Math.sign = Math.sign || function(x) {
  x = +x; // convert to a number
  if (x === 0 || isNaN(x)) {
    return x;
  }
  return x > 0 ? 1 : -1;
}

baselineCreate('bps-flows');
baselineCreate('bps-counters');
baselineCreate('pps-flows');
baselineCreate('pps-counters');
var test = {};
var agent = null;
function initializeTest() {
  baselineReset('bps-flows');
  baselineReset('bps-counters');
  baselineReset('pps-flows');
  baselineReset('pps-counters');
  test.agent = agent;
  test.agentInfo = agents([agent])[agent];
  test.trend = null;
  test.flowSamples = 0;
  test.flowInputPorts = {};
  test.flowOutputPorts = {};
  test.flowSizePackets = 0;
  test.flowSizeErrors = 0;
  test.flowSizeStrippedErrors = 0;
  test.icmpTest = {};
  test.features = {};
  test.start = Date.now();
}

setFlow('sflow-test-bytes',{value:'bytes',filter:'direction=ingress',t:1});
setFlow('sflow-test-frames',{value:'frames',filter:'direction=ingress',t:1});
setFlow('sflow-test-ports',{keys:'inputifindex,outputifindex',value:'frames',filter:'direction=ingress',log:true, activeTimeout:10});
setFlow('sflow-test-sizes',{keys:'ip_offset,ipbytes,bytes,stripped',value:'frames',filter:'direction=ingress',log:true,activeTimeout:10});
setFlow('sflow-test-icmp',{keys:'ipsource,ipdestination,icmptype,icmpseqno',value:'frames',filter:'direction=ingress&prefix:stack:.:1=eth',log:true,flowStart:true,activeTimeout:1});

var featureMetrics = [
  {key:'host_name', descr: 'Host name'},
  {key:'ifname', descr: 'Port name'},
  {key:'load_one', descr: 'CPU load average'},
  {key:'cpu_idle', descr: 'CPU utilization'},
  {key:'cpu_5sec', descr: 'CPU utilization (struct processor)'},
  {key:'mem_free', descr: 'Memory utilization'},
  {key:'agg_actorsystemid', descr:'LAG-MIB dot3adAggPortActorSystemID'},
  {key:'agg_attachedaggid', descr:'LAG-MIB dot3adAggPortAttachedAggID'},
  {key:'agg_partneropersystemid', descr:'LAG-MIB dot3adAggPortPartnerOperSystemID'},
  {key:'opt_module_id', descr:'Optical module ID'},
  {key:'opt_module_lanes', descr:'Optical module lanes'}
];
var featureRecs = [
  {key:'inputifindex',missing:'0',descr:'Ingress ifIndex'},
  {key:'outputifindex',missing:'0',descr:'Egress IfIndex'},
  {key:'vlansource',descr:'Source VLAN'},
  {key:'vlandestination',descr:'Destination VLAN'},
  {key:'prioritysource',descr:'Source priority'},
  {key:'prioritydestination',descr:'Destination priority'},
  {key:'ipnexthoprouter',descr:'Next-hop router'},
  {key:'ipsourcemaskbits',descr:'Source address prefix'},
  {key:'ipdestinationmaskbits',descr:'Destination address prefix'},
  {key:'bgpnexthop',descr:'BGP next hop'},
  {key:'bgpas',descr:'BGP AS'},
  {key:'bgpsourceas',descr:'BGP source AS'},
  {key:'bgpsourcepeeras',descr:'BGP source peer AS'},
  {key:'bgpdestinationaspath',descr:'BGP destination AS path'},
  {key:'bgpcommunities',descr:'BGP communities'},
  {key:'bgplocalpref',descr:'BGP localpref'}
];
var featureKeys = featureRecs.map(rec => 'null:'+rec.key);
setFlow('sflow-test-features',{keys:featureKeys,value:'frames',filter:'direction=ingress',log:true,flowStart:true,activeTimeout:10});

function testRandom(signs) {
  // Runs test for detecting non-randomness
  // http://www.itl.nist.gov/div898/handbook/eda/section3/eda35d.htm

  var res = 'unknown';

  var n1 = 0;
  var n2 = 0;
  var runs = 0;
  var prev = 0;
  for(var i = 0; i < signs.length; i++) {
    let sign = signs[i];
    if(sign === 0) continue;

    if(sign !== prev) {
      runs++;
      prev = sign;
    }
    if(sign === 1) n1++;
    else if(sign === -1) n2++; 
  }
  if(n1 > 10 && n2 > 10) {
    var expected_runs = ((2 * n1 * n2) / (n1 + n2)) + 1;
    var sdev_runs = (2 * n1 * n2 * ((2 * n1 * n2) - n1 - n2)) / (Math.pow(n1 + n2,2) * (n1 + n2 - 1));
    var z = Math.abs((expected_runs - runs) / sdev_runs);
    if(z > 1.96) res = 'failed';
    else res = 'passed';
  }
  return res;
}

setFlowHandler(function(rec) {
  if(rec.agent != test.agent) return;

  switch(rec.name) {
    case 'sflow-test-ports':
      let [input,output] = rec.flowKeys.split(',');
      test.flowInputPorts[input] = true;
      test.flowOutputPorts[output] = true;
      break;
    case 'sflow-test-sizes':
      let [ip_offset,ipbytes,bytes,stripped] = rec.flowKeys.split(',');
      ip_offset = parseInt(ip_offset);
      ipbytes = parseInt(ipbytes);
      bytes = parseInt(bytes);
      stripped = parseInt(stripped);
      let samples = 1;
      let info = datasourceInfo(rec.agent,rec.dataSource);
      if(info) {
        let samplingRate = info.samplingRate;
        if(samplingRate) {
          samples = Math.max(1,Math.round(rec.value / samplingRate));
        }
      }
      if(bytes >= 68) {
        if(bytes != (ip_offset+ipbytes+stripped)) test.flowSizeErrors+=samples;
        else test.flowSizePackets+=samples;
      }
      if(stripped < 4) test.flowSizeStrippedErrors+=samples;
      break;
    case 'sflow-test-icmp':
      let [ipsource,ipdestination,icmptype,icmpseqno] = rec.flowKeys.split(',');
      let testkey = ipsource+','+ipdestination+','+icmptype;
      let seqno = parseInt(icmpseqno);
      let res = test.icmpTest[testkey];
      if(res) {
        let info = datasourceInfo(rec.agent,rec.dataSource);
        if(info) {
          let samplingRate = info.samplingRate;
          if(samplingRate) {
            let predicted = res.seqno + samplingRate;
            let delta = ((seqno < res.seqno ? seqno + 65536 : seqno) - predicted) / samplingRate;
            res.deltas.push(delta);
            if(res.deltas.length > 100) res.deltas.shift();
          }
          let increment = (seqno < res.seqno ? seqno + 65536 : seqno) - res.seqno;
          res.increments.push(increment);
          if(res.increments.length > 100) res.increments.shift();
          res.seqno = seqno; 
        }
      } else {
        res = {seqno:seqno,deltas:[],increments:[]};
        test.icmpTest[testkey] = res;
      }
      break;
    case 'sflow-test-features':
      let keyvals = rec.flowKeys.split(',');
      for(let i = 0; i < keyvals.length; i++) {
        let keyval = keyvals[i];
        if(keyval == 'null' || (featureRecs[i].hasOwnProperty('missing') && keyval == featureRecs[i].missing)) continue;
        test.features[featureRecs[i].key] = true;
      }
      break;
  }
},['sflow-test-ports','sflow-test-sizes','sflow-test-icmp','sflow-test-features']);

function checkFeatures(res) {
  var i,m,found;
  if(!test.agent) return;

  for(i = 0; i < featureRecs.length; i++) {
    found = test.features[featureRecs[i].key];
    res.push(testResult(featureRecs[i].key,'Flow: '+featureRecs[i].descr,found?FOUND:NOTFOUND,found?"Found":"Not found"));
  }
  for(i = 0; i < featureMetrics.length; i++) {
    m = metric(test.agent,featureMetrics[i].key);
    found = m && m[0] && m[0].metricN;
    res.push(testResult(featureMetrics[i].key,'Counter: '+featureMetrics[i].descr,found?FOUND:NOTFOUND,found?"Found":"Not found"));
  }
}

function checkDuration(res) {
  var elapsed = (Date.now() - test.start) / 1000;
  var status = elapsed < 300 ? WAIT : PASS;
  res.push(testResult("duration","Test duration",status,formatNumber(elapsed,"#,##0 seconds")));
}

function checkAgent(res) {
  if(!test.agent || !test.agentInfo) return;
  
  var agentInfo = agents([test.agent])[test.agent];
  if(!agentInfo) return;

  var agtErrorCounters = [
    'sFlowDatagramsDuplicates',
    'sFlowDatagramsOutOfOrder',
    'sFlowCounterDuplicateSamples',
    'sFlowCounterOutOfOrderSamples',
    'sFlowFlowDuplicateSamples',
    'sFlowFlowOutOfOrderSamples'
  ];

  var counter, val, thresh = 10, prev = test.agentInfo; 
  for each (counter in agtErrorCounters) {
    val = agentInfo[counter] - prev[counter];
    if(val > thresh) break;
  }
  var datagrams = prev ? agentInfo['sFlowDatagramsReceived'] - prev['sFlowDatagramsReceived'] : agentInfo['sFlowDatagramsReceived'];
  res.push(testResult("seqno","Check sequence numbers", val > thresh ? FAIL : (datagrams ? PASS : WAIT), val > thresh ? counter : formatNumber(datagrams,'#,### datagrams')));
}

function checkDatasources(res) {
  if(!test.agent) return;

  var dataSources = {};
  for each (var m in dump(test.agent,'ifinpkts,sflow-test-frames')) {
     dataSources[m.dataSource] = m.dataSource;
  }
 
  var ds, msg, dir, flow = 0, counter = 0; 
  for(ds in dataSources) {
    let info = datasourceInfo(test.agent,ds);
    if(info && info.samplingRate) {
      flow++;
      let diff = Math.abs((info.effectiveSamplingRate - info.samplingRate) / info.samplingRate);
      if(diff > 0.2) {
        msg = "packet loss or inconsistent sample pool, ifIndex="+ds;
        break;
      }
    }
    if(info.counterSamples) {
      counter++;
      if(info.effectivePollingInterval > 40000) {
        msg = "polling interval="+Math.round(info.effectivePollingInterval/1000)+" seconds, ifIndex="+ds;
      } 
    }
  }
  res.push(testResult("datasources","Check data sources", msg ? FAIL : (flow > 0 && counter > 0) ? PASS : WAIT, msg ? msg : "counter="+counter+" flow="+flow));
}

function checkFlowSize(res) {
  var status, msg;
  if(test.flowSizeStrippedErrors) {
    status = FAIL;
    msg = formatNumber(test.flowSizeStrippedErrors,'#,### bad stripped samples');
  } else if(test.flowSizeErrors) {
    status = FAIL;
    msg = formatNumber(test.flowSizeErrors,'#,### bad samples');
  } else if(test.flowSizePackets < 1000) {
    status = WAIT;
    msg = formatNumber(test.flowSizePackets,'#,### samples');
  } else {
    status = PASS;
    msg = formatNumber(test.flowSizePackets,'#,### samples');
  }
  res.push(testResult("pktsize","Sampled packet size",status,msg)); 
}

function checkRandomness(res) {
  if(!test.icmpTest) return;

  var passed = 0;
  var failed = 0;
  for(var key in test.icmpTest) {
    var entry = test.icmpTest[key];
    var result = testRandom(entry.deltas.map(function(x) Math.sign(x)));
    switch(result) {
      case 'passed':
        passed++;
        break;
      case 'failed':
        failed++;
        break;
      case 'unknown':
        break;    
    }
    result = testRandom(entry.increments.map(function(x) x % 2 === 0 ? 1 : -1));
    switch(result) {
      case 'passed':
        passed++;
        break;
      case 'failed':
        failed++;
        break;
      case 'unknown':
        break;
    } 
  }
  res.push(testResult("random","Random number generator", failed > 0 ? FAILED : (passed === 0 ? WAIT : PASS),"passed="+passed+" failed="+failed));
}

function checkBias(res) {
  var stats_counters,stats_flows,status,diff,msg;
  stats_counters = baselineStatistics('bps-counters');
  stats_flows = baselineStatistics('bps-flows');
  if(stats_counters && stats_flows) {
    diff = 100 * Math.abs(stats_counters.mean - stats_flows.mean) / stats_counters.mean;  
    msg = formatNumber(diff, "0'%' difference");
    if(diff < 40) status = PASS;
    else status = FAIL;
  } else {
    msg = null;
    status = WAIT;
  }
  res.push(testResult("bytes","Compare byte flows to counters",status,msg));
  stats_counters = baselineStatistics('pps-counters');
  stats_flows = baselineStatistics('pps-flows');
  if(stats_counters && stats_flows) {
    diff = 100 * Math.abs(stats_counters.mean - stats_flows.mean) / stats_counters.mean;
    msg = formatNumber(diff, "0'%' difference");
    if(diff < 40) status = PASS;
    else status = FAIL;
  } else {
    msg = null;
    status = WAIT;
  }
  res.push(testResult("packets","Compare packet flows to counters",status,msg));
}

function checkIngressPorts(res) {
  var status, count = 0, inputPortCount = 0, outputPortCount = 0;
  if(test.flowInputPorts) {
    for(var prt in test.flowInputPorts) {
      count++;
      if('internal' === prt || 'multiple' === prt || '0' === prt) continue;
      inputPortCount++;
    }
  }
  if(test.flowOutputPorts) {
    for(var prt in test.flowOutputPorts) {
      if('internal' === prt || 'multiple' === prt || '0' === prt) continue;
      outputPortCount++;
    }
  }
  if(count === 0) status = WAIT;
  else if(inputPortCount > 0) status = PASS;
  else status = FAIL;
  res.push(testResult("ingressportinfo","Check ingress port information",status,"ingress="+inputPortCount+" egress="+outputPortCount));
}

setIntervalHandler(function(now) {
  if(!test.agent) return;
  if(!test.trend) test.trend = new Trend(300,1);

  var points = {};

  var res = metric(test.agent,'sum:ifinoctets,sum:sflow-test-bytes,sum:ifinpkts,sum:sflow-test-frames');
  if(!res) return;

  points['bps-counters'] = (res[0].metricValue || 0) * 8;
  points['bps-flows'] = (res[1].metricValue || 0) * 8;
  points['pps-counters'] = res[2].metricValue || 0;
  points['pps-flows'] = res[3].metricValue || 0;

  // calculate flow sample rate
  var flowSampleRate = 0;
  var agentInfo = agents([test.agent])[test.agent];
  if(agentInfo) {
    let flowSamples = agentInfo.sFlowFlowSamples;
    if(test.flowSamples) flowSampleRate = flowSamples - test.flowSamples;
    test.flowSamples = flowSamples; 
  }
  points['sample-rate'] = flowSampleRate;

  test.trend.addPoints(now,points);
  
  baselineCheck('bps-flows',points['bps-flows']);
  baselineCheck('bps-counters',points['bps-counters']);
  baselineCheck('pps-flows',points['pps-flows']);
  baselineCheck('pps-counters',points['pps-counters']);
},1);

setHttpHandler(function(req) {
  var result, tests, path = req.path;
  if(!path || path.length !== 1) throw "not_found";

  switch(path[0]) {
    case 'agents':
      result = {agents:[]};
      if(agent) result.agent = agent;
      for(let agt in agents()) result.agents.push(agt);
      result.agents.sort();
      break;
    case 'agent':
      agent = req.query.agent;
      break;
    case 'start':
      initializeTest();
      break;
    case 'stop':
      break;
    case 'checks':
      result = {version:version,time:Date.now()};
      if(test.trend) result.trend = test.trend;
     
      tests = [];
      checkDuration(tests);
      checkAgent(tests);
      checkDatasources(tests);
      checkFlowSize(tests);
      checkBias(tests);
      checkIngressPorts(tests);
      if(includeRandomTest) checkRandomness(tests);
      checkFeatures(tests);
      result.tests = tests;
      break;
    case 'upload':
      try { http(submitURL,'post','application/json',JSON.stringify(req.body)); }
      catch(e) { logWarning('upload failed ' + e); }
      break;
    default:
      throw "not_found";
  }

  return result;
});
