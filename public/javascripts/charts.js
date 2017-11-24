function addHistorical(price_data, symbol){
	if (symbol.length > 0){
	    jsonObj = price_data;
		if ('Error Message' in jsonObj) return false;
		metadata = jsonObj['Meta Data'];
		timedata = jsonObj['Time Series (Daily)'];
		HistoricalData = new Array();
		HistoricalCat = new Array();
		var i = 0;
		for (time in timedata){
				/*
				HistoricalCat.unshift(time.substring(5).replace("-","/"));
				HistoricalData.unshift(parseFloat(arrayData[i][time]["4. close"]));
				*/
				HistoricalData.unshift([moment(time).valueOf(),parseFloat(timedata[time]["4. close"])]);
				i++;
				if (i > 1000) break;
		}
		Highcharts.stockChart('historicalHighcharts', {

	        title: {
	            text: symbol + ' Stock Value'
	        },
	        subtitle: {
	            text: '<a style="text-decoration:none;"href="https://www.alphavantage.co/"> Source: Alpha Vantage</a>',
	            useHTML: true
	        },
	        rangeSelector :{
	        	buttons: [{
	        		type: 'week',
	        		count: 1,
	        		text: '1w'
	        	}, {
				    type: 'month',
				    count: 1,
				    text: '1m'
				}, {
				    type: 'month',
				    count: 3,
				    text: '3m'
				}, {
				    type: 'month',
				    count: 6,
				    text: '6m'
				}, {
				    type: 'ytd',
				    text: 'YTD'
				}, {
				    type: 'year',
				    count: 1,
				    text: '1y'
				}, {
				    type: 'all',
				    text: 'All'
				}],
				selected : 0
	        },

	        /*
	        xAxis: {
	        	categories: PriceCat
	        },
	        */
	        yAxis: {
	            title: {
	                text: 'Stock Value'
	            },
	            min: 0
	        },
	        plotOptions: {
	            area: {
	            	enabled: false,
	            	symbol: 'circle',

	                lineWidth: 1,
	                states: {
	                    hover: {
	                        lineWidth: 2,
	                        marker: {
	                    		radius: 2
	                		},
	                    }
	                },
	                threshold: null
	            }
	        },
	        tooltip:{
	            	valueDecimals: 2,
	            	split: false,
	            	shared: false,
	            	xDateFormat: '%A, %b %e, %Y'
	        },
	        series: [{
	            type: 'area',
	            name: metadata["2. Symbol"],
	            data: HistoricalData,

	        }]
	    });
	    return true;
	} else 
		return false;
}

function addPrice(price_data, symbol){
	if (symbol.length > 0){
	    jsonObj = price_data;
		if ('Error Message' in jsonObj) return false;
		metadata = jsonObj['Meta Data'];
		timedata = jsonObj['Time Series (Daily)'];
		PriceData = new Array();
		VolumeData = new Array();
		PriceCat = new Array();
		var last6 = moment().subtract(6, 'months');
		var arrayData = Array(timedata);
		for (i = 0; i < arrayData.length;i++){
			for (time in arrayData[i]){
				if (moment(time,"YYYY-MM-DD") > last6) {
					PriceCat.unshift(time.substring(5).replace("-","/"));
					PriceData.unshift(parseFloat(arrayData[i][time]["4. close"]));
					VolumeData.unshift(parseFloat(arrayData[i][time]["5. volume"]));
				}
			}
		}
		Highcharts.chart('PriceHighcharts', {
			chart: {
			    zoomType: 'x',
			    resetZoomButton: {
			        position: {
			            x: 0,
			            y: -30
			        }
			    }
			},
	        title: {
	            text: symbol + ' Stock Price and Volume'
	        },
	        subtitle: {
	            text: '<a style="text-decoration:none;"href="https://www.alphavantage.co/"> Source: Alpha Vantage</a>',
	            useHTML: true
	        },
	        legend:{
    			layout: 'vertical',
	        },
	        xAxis: {
	        	categories: PriceCat,
	            tickInterval: 5,
	            labels:{
	            	rotation : -45,
	            }
	        },
	        yAxis: [{
	            title: {
	                text: 'Stock Price'
	            },
	            min: 0
	        },{
	        	title: {
	        		text: 'Volume'
	        	},
	        	label:{
	        		formatter: function(){
	        			return this.value/1000000 + "M";
	        		}
	        	},
	        	opposite: true,
	        }],
	        plotOptions: {
	            area: {
	            	enabled: false,
	            	symbol: 'circle',
	            	lineColor : '#1100fb',
	                lineWidth: 1,
            	    marker: {
                		radius: 1,
                		fillColor: '#1100fb',
                		lineColor: '#1100fb'
            		},
	                states: {
	                    hover: {
	                        lineWidth: 2,
	                        marker: {
	                    		radius: 2,
	                    		fillColor: '#1100fb',
	                    		lineColor: '#1100fb'
	                		},
	                    }
	                },
	                threshold: null
	            },
	            colunm:{
	            	minPointLength: 100
	            },
	    
	        },
	        series: [{
	            type: 'area',
	            name: metadata["2. Symbol"],
	            data: PriceData,
	            color: '#e6e6fe'
	        },{
	        	type: 'column',
	        	name: metadata["2. Symbol"] + " Volume",
	        	data: VolumeData,
	        	color: '#fd191f',
	        	pointWidth: 2,
	        	yAxis: 1
	        }]
	    });
	    return true;
	} else 
		return false;
}
function addSMA(sma_data, symbol){
if (symbol.length > 0){
	jsonObj = sma_data;
	if ('Error Message' in jsonObj) return false;
	metadata = jsonObj['Meta Data'];
	timedata = jsonObj['Technical Analysis: SMA'];
	SMAData = new Array();
	SMACat = new Array();
	var last6 = moment().subtract(6, 'months');
	var arrayData = Array(timedata);
	for (i = 0; i < arrayData.length;i++){
		for (time in arrayData[i]){
			if (moment(time,"YYYY-MM-DD") > last6) {
				SMACat.unshift(time.substring(5).replace("-","/"));
				SMAData.unshift(parseFloat(arrayData[i][time]["SMA"]));
			}
		}
	}
	Highcharts.chart('SMAHighcharts', {
		chart: {
		    zoomType: 'x',
		    resetZoomButton: {
		        position: {
		            x: 0,
		            y: -30
		        }
		    }
		},
        title: {
            text: metadata['2: Indicator']
        },
        subtitle: {
            text: '<a style="text-decoration:none;"href="https://www.alphavantage.co/"> Source: Alpha Vantage</a>',
            useHTML: true
        },
        legend:{
			layout: 'vertical',
        },
        xAxis: {
        	categories: SMACat,
            tickInterval: 5,
            labels:{
            	rotation : -45,
            }
            
        },
        yAxis: [{
            title: {
                text: "SMA"
            }
        }],
        plotOptions: {
            line: {
            	symbol: 'circle',
            	marker:{
            		radius: 2
            	},
                lineWidth: 2,
                states: {
                    hover: {
                        lineWidth: 2,
                        marker: {
                    		radius: 2
                		},
                    }
                },
                threshold: null
            },
    
        },
        series: [{
            type: 'line',
            name: metadata["1: Symbol"],
            data: SMAData,
            color: '#f38b8d'
        }]
    });
	    return true;
	} else 
	return false;
} 
function addEMA(ema_data, symbol){
if (symbol.length > 0){	
	jsonObj = ema_data;
	if ('Error Message' in jsonObj) return false;
	metadata = jsonObj['Meta Data'];
	timedata = jsonObj['Technical Analysis: EMA'];
	EMAData = new Array();
	EMACat = new Array();
	var last6 = moment().subtract(6, 'months');
	var arrayData = Array(timedata);
	for (i = 0; i < arrayData.length;i++){
		for (time in arrayData[i]){
			if (moment(time,"YYYY-MM-DD") > last6) {
				EMACat.unshift(time.substring(5).replace("-","/"));
				EMAData.unshift(parseFloat(arrayData[i][time]["EMA"]));
			}
		}
	}
	Highcharts.chart('EMAHighcharts', {
		chart: {
		    zoomType: 'x',
		    resetZoomButton: {
		        position: {
		            x: 0,
		            y: -30
		        }
		    }
		},		
        title: {
            text: metadata['2: Indicator']
        },
        subtitle: {
            text: '<a style="text-decoration:none;"href="https://www.alphavantage.co/"> Source: Alpha Vantage</a>',
            useHTML: true
        },
        legend:{
			layout: 'vertical',
        },
        xAxis: {
        	categories: EMACat,
            tickInterval: 5,
            labels:{
            	rotation : -45,
            }
            
        },
        yAxis: [{
            title: {
                text: "EMA"
            }
        }],
        plotOptions: {
            line: {
            	symbol: 'circle',
            	marker:{
            		radius: 2
            	},
                lineWidth: 2,
                states: {
                    hover: {
                        lineWidth: 2,
                        marker: {
                    		radius: 2
                		},
                    }
                },
                threshold: null
            },
    
        },
        series: [{
            type: 'line',
            name: metadata["1: Symbol"],
            data: EMAData,
            color: '#f38b8d'
        }]
    });
    return true;
} else
	return false;
}

function addSTOCH(stoch_data, symbol){
if (symbol.length > 0){	
	jsonObj = stoch_data;
	if ('Error Message' in jsonObj) return false;
	metadata = jsonObj['Meta Data'];
	timedata = jsonObj['Technical Analysis: STOCH'];
	STOCH_SlowD = new Array();
	STOCH_SlowK = new Array();
	STOCHCat = new Array();
	var last6 = moment().subtract(6, 'months');
	var arrayData = Array(timedata);
	for (i = 0; i < arrayData.length;i++){
		for (time in arrayData[i]){
			if (moment(time,"YYYY-MM-DD") > last6) {
				STOCHCat.unshift(time.substring(5).replace("-","/"));
				STOCH_SlowD.unshift(parseFloat(arrayData[i][time]["SlowD"]));
				STOCH_SlowK.unshift(parseFloat(arrayData[i][time]["SlowK"]));
			}
		}
	}
	Highcharts.chart('STOCHHighcharts', {
		chart: {
		    zoomType: 'x',
		    resetZoomButton: {
		        position: {
		            x: 0,
		            y: -30
		        }
		    }
		},
	    title: {
	        text: metadata['2: Indicator']
	    },
	    subtitle: {
	        text: '<a style="text-decoration:none;"href="https://www.alphavantage.co/"> Source: Alpha Vantage</a>',
	        useHTML: true
	    },
	    legend:{
			layout: 'vertical',
	    },
	    xAxis: {
	    	categories: STOCHCat,
	        tickInterval: 5,
	        labels:{
	        	rotation : -45,
	        }
	        
	    },
	    yAxis: [{
	        title: {
	            text: "STOCH"
	        }
	    }],
	    plotOptions: {
	        line: {
	        	symbol: 'circle',
	        	marker:{
	        		radius: 2
	        	},
	            lineWidth: 2,
	            states: {
	                hover: {
	                    lineWidth: 2,
	                    marker: {
	                		radius: 2
	            		},
	                }
	            },
	            threshold: null
	        },

	    },
        series: [{
            type: 'line',
            name: metadata["1: Symbol"] + " SlowD",
            data: STOCH_SlowD,
            color: '#f38b8d'
        },{
        	type: 'line',
            name: metadata["1: Symbol"] + " SlowK",
            data: STOCH_SlowK,
        }]
	});
	return true;
	} else
	return false;
}

function addRSI(rsi_data, symbol){
if (symbol.length > 0){	
	jsonObj = rsi_data;
	if ('Error Message' in jsonObj) return false;
	metadata = jsonObj['Meta Data'];
	timedata = jsonObj['Technical Analysis: RSI'];
	RSIData = new Array();
	RSICat = new Array();
	var last6 = moment().subtract(6, 'months');
	var arrayData = Array(timedata);
	for (i = 0; i < arrayData.length;i++){
		for (time in arrayData[i]){
			if (moment(time,"YYYY-MM-DD") > last6) {
				RSICat.unshift(time.substring(5).replace("-","/"));
				RSIData.unshift(parseFloat(arrayData[i][time]["RSI"]));
			}
		}
	}
	Highcharts.chart('RSIHighcharts', {
		chart: {
		    zoomType: 'x',
		    resetZoomButton: {
		        position: {
		            x: 0,
		            y: -30
		        }
		    }
		},
        title: {
            text: metadata['2: Indicator']
        },
        subtitle: {
            text: '<a style="text-decoration:none;"href="https://www.alphavantage.co/"> Source: Alpha Vantage</a>',
            useHTML: true
        },
        legend:{
			layout: 'vertical',
        },
        xAxis: {
        	categories: RSICat,
            tickInterval: 5,
            labels:{
            	rotation : -45,
            }
            
        },
        yAxis: [{
            title: {
                text: "RSI"
            }
        }],
        plotOptions: {
            line: {
            	symbol: 'circle',
            	marker:{
            		radius: 2
            	},
                lineWidth: 2,
                states: {
                    hover: {
                        lineWidth: 2,
                        marker: {
                    		radius: 2
                		},
                    }
                },
                threshold: null
            },
        },
        series: [{
            type: 'line',
            name: metadata["1: Symbol"],
            data: RSIData,
            color: '#f38b8d'
        }]
    });
	return true;
	} else
	return false;
}

function addADX(adx_data, symbol){
if (symbol.length > 0){	
	jsonObj = adx_data;
	if ('Error Message' in jsonObj) return false;
	metadata = jsonObj['Meta Data'];
	timedata = jsonObj['Technical Analysis: ADX'];
	ADXData = new Array();
	ADXCat = new Array();
	var last6 = moment().subtract(6, 'months');
	var arrayData = Array(timedata);
	for (i = 0; i < arrayData.length;i++){
		for (time in arrayData[i]){
			if (moment(time,"YYYY-MM-DD") > last6) {
				ADXCat.unshift(time.substring(5).replace("-","/"));
				ADXData.unshift(parseFloat(arrayData[i][time]["ADX"]));
			}
		}
	}
	Highcharts.chart('ADXHighcharts', {
		chart: {
		    zoomType: 'x',
		    resetZoomButton: {
		        position: {
		            x: 0,
		            y: -30
		        }
		    }
		},
        title: {
            text: metadata['2: Indicator']
        },
        subtitle: {
            text: '<a style="text-decoration:none;"href="https://www.alphavantage.co/"> Source: Alpha Vantage</a>',
            useHTML: true
        },
        legend:{
			layout: 'vertical',
        },
        xAxis: {
        	categories: ADXCat,
            tickInterval: 5,
            labels:{
            	rotation : -45,
            }
            
        },
        yAxis: [{
            title: {
                text: "ADX"
            }
        }],
        plotOptions: {
            line: {
            	symbol: 'circle',
            	marker:{
            		radius: 2
            	},
                lineWidth: 2,
                states: {
                    hover: {
                        lineWidth: 2,
                        marker: {
                    		radius: 2
                		},
                    }
                },
                threshold: null
            },
    
        },
        series: [{
            type: 'line',
            name: metadata["1: Symbol"],
            data: ADXData,
            color: '#f38b8d'
        }]
    });
	return true;
	} else
	return false;
}


function addCCI(cci_data, symbol){
if (symbol.length > 0){	
	jsonObj = cci_data;
	if ('Error Message' in jsonObj) return false;
	metadata = jsonObj['Meta Data'];
	timedata = jsonObj['Technical Analysis: CCI'];
	CCIData = new Array();
	CCICat = new Array();
	var last6 = moment().subtract(6, 'months');
	var arrayData = Array(timedata);
	for (i = 0; i < arrayData.length;i++){
		for (time in arrayData[i]){
			if (moment(time,"YYYY-MM-DD") > last6) {
				CCICat.unshift(time.substring(5).replace("-","/"));
				CCIData.unshift(parseFloat(arrayData[i][time]["CCI"]));
			}
		}
	}
	Highcharts.chart('CCIHighcharts', {
		chart: {
		    zoomType: 'x',
		    resetZoomButton: {
		        position: {
		            x: 0,
		            y: -30
		        }
		    }
		},
        title: {
            text: metadata['2: Indicator']
        },
        subtitle: {
            text: '<a style="text-decoration:none;"href="https://www.alphavantage.co/"> Source: Alpha Vantage</a>',
            useHTML: true
        },
        legend:{
			layout: 'vertical',
        },
        xAxis: {
        	categories: CCICat,
            tickInterval: 5,
            labels:{
            	rotation : -45,
            }
            
        },
        yAxis: [{
            title: {
                text: "CCI"
            }
        }],
        plotOptions: {
            line: {
            	symbol: 'circle',
            	marker:{
            		radius: 2
            	},
                lineWidth: 2,
                states: {
                    hover: {
                        lineWidth: 2,
                        marker: {
                    		radius: 2
                		},
                    }
                },
                threshold: null
            },
    
        },
        series: [{
            type: 'line',
            name: metadata["1: Symbol"],
            data: CCIData,
            color: '#f38b8d'
        }]
    });
	return true;
	} else
	return false;
}


function addBBANDS(bbands_data, symbol){
if (symbol.length > 0){	
	jsonObj = bbands_data;
	if ('Error Message' in jsonObj) return false;
	metadata = jsonObj['Meta Data'];
	timedata = jsonObj['Technical Analysis: BBANDS'];
	BBANDS_Upper = new Array();
	BBANDS_Lower = new Array();
	BBANDS_Middle = new Array();
	BBANDSCat = new Array();
	var last6 = moment().subtract(6, 'months');
	var arrayData = Array(timedata);
	for (i = 0; i < arrayData.length;i++){
		for (time in arrayData[i]){
			if (moment(time,"YYYY-MM-DD") > last6) {
				BBANDSCat.unshift(time.substring(5).replace("-","/"));
				BBANDS_Upper.unshift(parseFloat(timedata[time]["Real Upper Band"]));
				BBANDS_Lower.unshift(parseFloat(timedata[time]["Real Lower Band"]));
				BBANDS_Middle.unshift(parseFloat(timedata[time]["Real Middle Band"]));
			}
		}
	}
	Highcharts.chart('BBANDSHighcharts', {
		chart: {
		    zoomType: 'x',
		    resetZoomButton: {
		        position: {
		            x: 0,
		            y: -30
		        }
		    }
		},
	    title: {
	        text: metadata['2: Indicator']
	    },
	    subtitle: {
	        text: '<a style="text-decoration:none;"href="https://www.alphavantage.co/"> Source: Alpha Vantage</a>',
	        useHTML: true
	    },
	    legend:{
			layout: 'vertical',
	    },
	    xAxis: {
	    	categories: BBANDSCat,
	        tickInterval: 5,
	        labels:{
	        	rotation : -45,
	        }
	        
	    },
	    yAxis: [{
	        title: {
	            text: "BBANDS"
	        }
	    }],
	    plotOptions: {
	        line: {
	        	symbol: 'circle',
	        	marker:{
	        		radius: 2
	        	},
	            lineWidth: 2,
	            states: {
	                hover: {
	                    lineWidth: 2,
	                    marker: {
	                		radius: 2
	            		},
	                }
	            },
	            threshold: null
	        },

	    },
        series: [{
            type: 'line',
            name: metadata["1: Symbol"] + " Real Upper Band",
            data: BBANDS_Upper,
            color: '#f38b8d'
        },{
			type: 'line',
            name: metadata["1: Symbol"] + " Real Middle Band",
            data: BBANDS_Middle
        },{
        	type: 'line',
            name: metadata["1: Symbol"] + " Real Lower Band",
            data: BBANDS_Lower
        }]
	});
	return true;
	} else
	return false;
}

function addMACD(macd_data, symbol){
if (symbol.length > 0){	
	jsonObj = macd_data;
	if ('Error Message' in jsonObj) return false;
	metadata = jsonObj['Meta Data'];
	timedata = jsonObj['Technical Analysis: MACD'];
	MACD = new Array();
	MACD_Signal = new Array();
	MACD_Hist = new Array();
	MACDCat = new Array();
	var last6 = moment().subtract(6, 'months');
	var arrayData = Array(timedata);
	for (i = 0; i < arrayData.length;i++){
		for (time in arrayData[i]){
			if (moment(time,"YYYY-MM-DD") > last6) {
				MACDCat.unshift(time.substring(5).replace("-","/"));
				MACD.unshift(parseFloat(timedata[time]["MACD"]));
				MACD_Signal.unshift(parseFloat(timedata[time]["MACD_Signal"]));
				MACD_Hist.unshift(parseFloat(timedata[time]["MACD_Hist"]));
			}
		}
	}
	Highcharts.chart('MACDHighcharts', {
		chart: {
		    zoomType: 'x',
		    resetZoomButton: {
		        position: {
		            x: 0,
		            y: -30
		        }
		    }
		},
	    title: {
	        text: metadata['2: Indicator']
	    },
	    subtitle: {
	        text: '<a style="text-decoration:none;"href="https://www.alphavantage.co/"> Source: Alpha Vantage</a>',
	        useHTML: true
	    },
	    legend:{
			layout: 'vertical',
	    },
	    xAxis: {
	    	categories: MACDCat,
	        tickInterval: 5,
	        labels:{
	        	rotation : -45,
	        }
	        
	    },
	    yAxis: [{
	        title: {
	            text: "MACD"
	        }
	    }],
	    plotOptions: {
	        line: {
	        	symbol: 'circle',
	        	marker:{
	        		radius: 2
	        	},
	            lineWidth: 2,
	            states: {
	                hover: {
	                    lineWidth: 2,
	                    marker: {
	                		radius: 2
	            		},
	                }
	            },
	            threshold: null
	        },

	    },
        series: [{
            type: 'line',
            name: metadata["1: Symbol"] + " MACD",
            data: MACD,
            color: '#f38b8d'
        },{
			type: 'line',
            name: metadata["1: Symbol"] + " MACD_Signal",
            data: MACD_Signal
        },{
        	type: 'line',
            name: metadata["1: Symbol"] + " MACD_Hist",
            data: MACD_Hist
        }]
	});
	return true;
	} else
	return false;
}

function getTableData(rawdata, symbol){
	try{
		var data = {};
		var TimeSeries = "Time Series (Daily)";
		var lastfreshed = rawdata['Meta Data']['3. Last Refreshed'].substring(0,10);
		data['symbol'] = rawdata['Meta Data']['2. Symbol'];
		data['close'] = parseFloat(rawdata[TimeSeries][lastfreshed]['4. close']).toFixed(2);
		var i = 0;
		for (time in rawdata[TimeSeries]){
			if (i == 1){
				data['previousclose'] = parseFloat(rawdata[TimeSeries][time]['4. close']).toFixed(2);
				break;
			}
			i++;
		}
		data['open'] = parseFloat(rawdata[TimeSeries][lastfreshed]['1. open']).toFixed(2);
		data['volume'] = parseInt(rawdata[TimeSeries][lastfreshed]['5. volume']).toLocaleString();
		data['high'] = parseFloat(rawdata[TimeSeries][lastfreshed]['2. high']).toFixed(2);
		data['low'] = parseFloat(rawdata[TimeSeries][lastfreshed]['3. low']).toFixed(2);
		data['change'] = (data['close'] - data['previousclose']).toFixed(2);
		data['changepercent'] = ((data['change'] / data['previousclose']) * 100).toFixed(2);
		if (rawdata['Meta Data']['3. Last Refreshed'].length <= 11)
			rawdata['Meta Data']['3. Last Refreshed'] += " 16:00:00";
		data['timestamp'] = moment.tz(rawdata['Meta Data']['3. Last Refreshed'], 'America/New_York').format("YYYY-MM-DD HH:mm:ss z");
		return data;
		}
	catch(e){
		return false;
	}
}

function getNews(rawdata, symbol){
	try{
	var data = [];
	var j = 0;
	for (i = 0; i < rawdata.rss.channel[0].item.length; i++){
		var item = rawdata.rss.channel[0].item[i];
		if (item.link[0].match(/article/i)){
			var time_zone = {
				"0900":"America/Anchorage",
				"1000":"America/Adak",
				"0700":"America/Phoenix",
				"0600":"America/Chicago",
				"0500":"America/New_York",
				"0800":"America/Los_Angeles",
				"1100":"Pacific/Pago_Pago",
				"0400":"America/Port_of_Spain"
			};
			var zone = moment.tz(item.pubDate[0], time_zone[item.pubDate[0].slice(-4)]).format("z");
			data.push({
				title: item.title[0],
				link: item.link[0], 
				pubDate: item.pubDate[0].slice(0,-5) + zone,
				author: item['sa:author_name'][0]
			});
			j++;
			if (j > 4) break;
		}
	}
	return data;
	}
	catch (e){
		return false;
	}
}
