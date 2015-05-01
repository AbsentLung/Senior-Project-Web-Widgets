var LINECHART = (function(){
	var sizeOfDomain; //Declare Variables
	var values;
	var fill = new Array();
	var sharpSmooth = new Array();
	var circlesOnOff = new Array();
	var pathOnOff = new Array();
	var axisC;
	var axisW;
	var pathColor;
	var pathWidth;
	var sizeOfCircles;
	var h;
	var w;
	var m;
	var yyTicks;
	var circlesC;
	var theXLabel;
	var theYLabel;
	var selectAllPaths;
	var circleOnOffDefault;
	var pathOnOffDefault;
	var sharpSmoothDefault;
	var fillDefault;
	var thisLocalHost;
	var thisMsgTopic;
	var mainChartDiv;
	var rangeMinF;
	var rangeMaxF;
	var rangeMin = new Array();
	var rangeMax = new Array();
	var endString = new Array();
	var divDomain
	var divCircleColor
	var divCircleSize
	var divValues
	var divYTicks
	var divm
	var divw
	var divh
	var divPathW
	var divPathC
	var divAxisW
	var divAxisC
	var divYLabel
	var divXLabel
	var divRangeMin
	var divRangeMax
	var divPathOnOff
	var divCirclesOnOff
	var divSharpSmooth
	var divFill
	var divSelectAll
	var divCSV
	var divLineButtons
	var divSelectedOption
	var divStatus
	var divClickedStatus
	var lineSelect = 0;
	var ils;
	var data_type = new Array();
	var y = new Array();
	var x;
	var CSVContents;
	return {
	createUserInterface: function(){}, //Declare Functions
	domainSize: function(){},
	valuesFunction: function(){},
	sharpSmoothFunction: function(){},
	circlesOnOffFunction: function(){},
	pathOnOffFunction: function(){},
	circleSize: function(){},
	circleColor: function(){},
	axisCFunct: function(){},
	axisWFunct: function(){},
	pathC: function(){},
	pathW: function(){},
	heightF: function(){},
	widthF: function(){},
	marginF: function(){},
	xLabel: function(){},
	yLabel: function(){},
	yyTicksF: function(){},
	fillFunction: function(){},
	newDomain: function(){},
	lineSelected: function(){},
	Start: function(){},
	changeLineSelected: function(optionLineSelect)
	{
		lineSelect = optionLineSelect;
	},
	unselectPaths: function()
	{
		selectAllPaths = false;
	},
	//Display where the options are shown to the user
	options1: function(optionDomain, optionValues, optionCircleSize, optionCircleColor)
	{
		divDomain = optionDomain
		divCircleColor = optionCircleColor
		divCircleSize = optionCircleSize
		divValues = optionValues
	},
	options2: function(optionh, optionw, optionm, optionYTicks)
	{
		divYTicks = optionYTicks;
		divm = optionm;
		divw = optionw;
		divh = optionh;
	},
	options3: function(optionAxisC, optionAxisW, optionPathC, optionPathW)
	{
		divPathW = optionPathW
		divPathC = optionPathC
		divAxisW = optionAxisW
		divAxisC = optionAxisC
	},
	options4: function(optionXLabel, optionYLabel, optionRangeMin, optionRangeMax)
	{
		divYLabel = optionYLabel
		divXLabel = optionXLabel
		divRangeMin = optionRangeMin
		divRangeMax = optionRangeMax
	},
	options5: function(optionCirclesOnOff, optionPathOnOff, optionSharpSmooth, optionFill, optionSelectAll)
	{
		divPathOnOff = optionPathOnOff
		divCirclesOnOff = optionCirclesOnOff
		divSharpSmooth = optionSharpSmooth
		divFill = optionFill
		divSelectAll = optionSelectAll
	},
	options6: function(thisCSV, thisLineButtons)
	{
		divCSV = thisCSV
		divLineButtons = thisLineButtons
	},
	options7: function(thisStatus, thisClickedStatus, thisSelectedOption)
	{
		divSelectedOption = thisSelectedOption
		divStatus = thisStatus
		divClickedStatus = thisClickedStatus
	},
	//Set defaults for the user's preference
	defaults1: function(defaultHeight, defaultWidth, defaultMargin)
	{
		h = defaultHeight;
		w = defaultWidth;
		m = defaultMargin;
	},
	defaults2: function(defaultXLabel, defaultYLabel, defaultAxisWidth, defaultAxisColor, defaultTicks)
	{
		theXLabel = defaultXLabel;
		theYLabel = defaultYLabel;
		axisW = defaultAxisWidth;
		axisC = defaultAxisColor;
		yyTicks = defaultTicks;
	},
	defaults3: function(defaultDomain, defaultValues, defaultRangeMin, defaultRangeMax, defaultEndString)
	{
		sizeOfDomain = defaultDomain;
		values = defaultValues;
		for (var i = 0; i < defaultRangeMin.length; i++) {
			rangeMin[i] = defaultRangeMin[i];
			rangeMax[i] = defaultRangeMax[i];
			y[i] = d3.scale.linear().domain([rangeMin[i], rangeMax[i]]).range([0 + m, h - m]);
			endString[i] = defaultEndString[i];
		}
	},
	defaults4: function(defaultPathWidth, defaultPathColor, defaultCircleSize, defaultCircleColor)
	{
		if (isNaN(defaultPathColor) == true)
				defaultPathColor = []
		if (isNaN(defaultPathWidth) == true)
				defaultPathWidth = []
		pathWidth = defaultPathWidth
		pathColor = defaultPathColor
		if (isNaN(defaultCircleColor) == true)
				defaultCircleColor = []
		if (isNaN(defaultCircleSize) == true)
				defaultCircleSize = []
		sizeOfCircles = defaultCircleSize;
		circlesC = defaultCircleColor;
	},
	defaults5: function(defaultCircle, defaultPath, defaultSharpSmooth, defaultFill, defaultSelectAll)
	{
		circleOnOffDefault = defaultCircle;
		pathOnOffDefault = defaultPath;
		fillDefault = defaultFill;
		selectAllPaths = defaultSelectAll;
		if (defaultSharpSmooth == true)
			sharpSmoothDefault = "linear";
		else
			sharpSmoothDefault = "monotone";
	},
	defaults6: function(datas)
	{
		for (var i = 0; i < datas.length; i++) {
			data_type[i] = datas[i];
		}
	},
	creatorGenerateChart: function(mcd, bcdiv, tlh, tmt, tmt2)
	{
		mainChartDiv = mcd;
		belowChartDiv = bcdiv;
		thisLocalHost = tlh
		thisMsgTopic = tmt;
		thisMsgTopic2 = tmt2;
	},
	createLineChart: function(){ //Renders Line Chart
		var paths = new Array(); //Initialize Variables
		var circles = new Array();
		var displayPoints = new Array();
		var timeAtPoint = new Array();
		var data = new Array();
		var data2 = new Array();
		var d = new Array();
		var oldD = new Array();
		var XpageX;
		var YpageY;
		var ePageX;
		var ePageY;
		var pageYFixed;
		var pageXFixed;
		var inputTextY;
		var data2Times = new Array();
		var slidePathVisibility = new Array();
		var lineBegin = d3.svg.area();
		var lineBegin2 = d3.svg.area();
		var line = d3.svg.area();
		var lineV2 = d3.svg.area();
		var colorDiv = new Array();
		var transitioning = "true";
		var oldDomainSize;
		var differenceInDomain;
		var oldData = new Array();
		var oldEachPathDataLength;
		var fromTheCloud = new Array();
		var eachPathData = new Array();
		var timeIn;
		var newDataIn = new Array();
		var numberOfPaths = eachPathData.length;
		var timetocompleteoneshift = new Array();
		function assignPaths(){}; //Create Functions
		function createPaths(){};
		function appendCircles(){};
		function userInterface(){};
		$(divDomain).html("<input type='text' onkeypress='LINECHART.domainSize(event)' id='butDomain'></text>"); //Append Options
		$(divCircleColor).html("<input type='text' onkeypress='LINECHART.circleColor(event)' id='butCircleColor'></text>");
		$(divCircleSize).html("<input type='text' onkeypress='LINECHART.circleSize(event)' id='butCircleSize'></text>");
		$(divValues).html("<input type='text' onkeypress='LINECHART.valuesFunction(event)' id='butValues'></text>");
		$(divYTicks).html("<input type='text' onkeypress='LINECHART.yyTicksF(event)' id='butYTicks'></text>");
		$(divm).html("<input type='text' onkeypress='LINECHART.marginF(event)' id='butm'></text>");
		$(divw).html("<input type='text' onkeypress='LINECHART.widthF(event)' id='butw'></text>");
		$(divh).html("<input type='text' onkeypress='LINECHART.heightF(event)' id='buth'></text>");
		$(divPathW).html("<input type='text' onkeypress='LINECHART.pathW(event)' id='butPathW'></text>");
		$(divPathC).html("<input type='text' onkeypress='LINECHART.pathC(event)' id='butPathC'></text>");
		$(divAxisW).html("<input type='text' onkeypress='LINECHART.axisWFunct(event)' id='butAxisW'></text>");
		$(divAxisC).html("<input type='text' onkeypress='LINECHART.axisCFunct(event)' id='butAxisC'></text>");
		$(divYLabel).html("<input type='text' onkeypress='LINECHART.yLabel(event)' id='butYLabel'></text>");
		$(divXLabel).html("<input type='text' onkeypress='LINECHART.xLabel(event)' id='butXLabel'></text>");
		$(divRangeMin).html("<input type='text' onkeypress='LINECHART.rangeMinF(event)' id='butRangeMin'></text>");
		$(divRangeMax).html("<input type='text' onkeypress='LINECHART.rangeMaxF(event)' id='butRangeMax'></text>");
		$(divPathOnOff).html("<input type='button' onclick='LINECHART.pathOnOffFunction()' id='butPathOnOff'></button>");
		$(divCirclesOnOff).html("<input type='button' onclick='LINECHART.circlesOnOffFunction()' id='butCirclesOnOff'></button>");
		$(divSharpSmooth).html("<input type='button' onclick='LINECHART.sharpSmoothFunction()' id='butSharpSmooth'></button>");
		$(divFill).html("<input type='button' onclick='LINECHART.fillFunction()' id='butFill'></button>")
		$(divSelectAll).html("<input type='button' id='butSelectAll'></button>");
		$(divCSV).html("<input type='file' id='butCSV' value='Browse CSV'></input>");
		$(divLineButtons).html("<span id='lineButtons'></span>");
		$(divSelectedOption).html("<span id='selectedOption'></span>");
		$(divStatus).html("<span id='status'></span>");
		$(divClickedStatus).html("<span id='clickedStatus'></span>");
		butXLabel.value = theXLabel;
		butYLabel.value = theYLabel;
		butSelectAll.value = "Select All"
		if (sharpSmoothDefault == true)
			butSharpSmooth.value = "smooth";
		else
			butSharpSmooth.value = "sharp";
		if (circleOnOffDefault == true)
			butCirclesOnOff.value = "Circles Off";
		else
			butCirclesOnOff.value = "Circles";
		if (pathOnOffDefault == true)
			butPathOnOff.value = "Paths Off";
		else
			butPathOnOff.value = "Paths";
		if (fillDefault == true)
			butFill.value = "Fill Off";
		else
			butFill.value = "Fill";
		var firstFile = true;
		var count = 0;
		numberOfPaths = 5;
		function generateData() {
			for (var i = 0; i < CSVContents[0].length-1; i++)
			{
				data[i] = []
				oldData[i] = []
				for (var j = 0; j < sizeOfDomain; j++)
				{
					oldData[i][j] = rangeMin[i];
					data[i][j] = rangeMin[i];
				}
				if (firstFile) {
					paths[i] = linesPath
						.data([0])
						.enter().insert("path");
					circles[i] = axisCircles
						.data([0])
						.enter().append("circle");
					if (i==4)
						firstFile = false;
				}
				else {
					assignPaths();
				}
				data2[i] = []
				for (var j = 0; j < sizeOfDomain; j++)
					data2[i][j] = rangeMin[j];
			}
			for (var i = 0; i < CSVContents.length-1; i++)
			{
				var s = CSVContents[i][0];
				s = "20" + s.substring(0, 2) + '-' + s.substring(2, 4) + '-' + s.substring(4, 6) + 'T' + s.substring(6, 8) + ':' + s.substring(8, 10) + ':' + s.substring(10, 12);
				for (var j = 1; j < CSVContents[0].length; j++) {
					data[j-1][i] = CSVContents[i][j];
					data2[j-1][i] = new Date(s);
					eachPathData[j-1] = data[j-1][i];
				}
			}
			for (var i = 1; i < CSVContents[0].length; i++)
				newDataIn[i-1] = true;
		}
		function readCSV(evt) {
			var files = evt.target.files;
			if (files) {
				for (var i = 0, f; f = files[i]; i++) {
					var r = new FileReader();
					r.onload = (function (f) {
						return function (e) {
							CSVContents = e.target.result;
							CSVContents = CSVContents.split('\n')
							for (var i = 0; i < CSVContents.length; i++) {
								CSVContents[i] = CSVContents[i].split(',');
							}
							generateData();
							LINECHART.Start();
						};
					})(f);
					r.readAsText(f);
				}
			}
			else {
				alert("Failed to load files");
			}
		}
		document.getElementById('butCSV').addEventListener('change', readCSV, false);
		$("#status").html(".") //Empty the div shown for the status
		$("#clickedStatus").html(".")
		x = d3.scale.linear().domain([0, sizeOfDomain]).range([m, w]);
		belowChart = document.getElementById(belowChartDiv); //Append Div below the Chart
		$(mainChartDiv).append(belowChart);
		var vis = d3.select(mainChartDiv)
			.append("svg")
			.attr("class", "chartSVG")
			.attr("width", w + m)
			.attr("height", h + m);
		vis.append("linearGradient") //Color Gradients
			.attr("id", "tempGradient")
			.attr("gradientUnits", "userSpaceOnUse")
			.attr("x1", 0).attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", 0).attr("y2", -1 * y[0](rangeMax[0]))
			.selectAll("stop")
			.data([
				{offset: "0%", color: "CornFlowerBlue"},
				{offset: "50%", color: "Gold"},
				{offset: "100%", color: "FireBrick"}
			])
			.enter().append("stop")
			.attr("offset", function(d) { return d.offset; })
			.attr("stop-color", function(d) { return d.color; });
		vis.append("linearGradient")
			.attr("id", "lightGradient")
			.attr("gradientUnits", "userSpaceOnUse")
			.attr("x1", 0).attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", 0).attr("y2", -1 * y[0](rangeMax[0]))
			.selectAll("stop")
			.data([
				{offset: "0%", color: "Black"},
				{offset: "100%", color: "LightYellow"}
			])
			.enter().append("stop")
			.attr("offset", function(d) { return d.offset; })
			.attr("stop-color", function(d) { return d.color; });
		vis.append("linearGradient")
			.attr("id", "soundGradient")
			.attr("gradientUnits", "userSpaceOnUse")
			.attr("x1", 0).attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", 0).attr("y2", -1 * y[0](rangeMax[0]))
			.selectAll("stop")
			.data([
				{offset: "0%", color: "Brown"},
				{offset: "30%", color: "Pink"},
				{offset: "70%", color: "Violet"},
				{offset: "100%", color: "LightGray"}
			])
			.enter().append("stop")
			.attr("offset", function(d) { return d.offset; })
			.attr("stop-color", function(d) { return d.color; });
		//Data-Detecting Function
		jQuery(document).ready(function(){
			$(".chartSVG").mousemove(function(e){
				ePageX = e.pageX.toFixed(Math.floor(values/sizeOfDomain/10).toString().length);
				ePageY = e.pageY;
			});
		})
		var lineChart = vis.append("g") //Generate empty Line Chart
			.attr("transform", "translate(0, " + h + ")")
		var lineChartPath = vis.append("g")
			.attr("transform", "translate(0, " + h + ")")
		var lineChartPath2 = vis.append("g")
			.attr("transform", "translate(0, " + h + ")")
		var lineChartPathBegin = vis.append("g")
			.attr("transform", "translate(0, " + h + ")")
		var lineChartIntro = vis.append("g")
			.attr("transform", "translate(0, " + h + ")")
		var linesPath = lineChartPath.selectAll("path");
		var linesPath2 = lineChartPath2.selectAll("path");
		var linesPathBegin = lineChartPathBegin.selectAll("path");
		var pathDiv = vis.append("g");
		var axisCircles = pathDiv.selectAll("circle");
		var lineChartXLine = lineChart.append("line")
			.attr("x1", x(0))
			.attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", x(0))
			.attr("y2", -1 * y[0](rangeMax[0]))
			.style("stroke", axisC);
		var lineChartXTicks = lineChart.selectAll(".xTicks")
			.data(x.ticks(1))
			.enter().append("line")
			.attr("class", "xTicks")
			.attr("x1", x(0))
			.attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", x(sizeOfDomain))
			.attr("y2", -1 * y[0](rangeMin[0]))
			.style("stroke", axisC)
		var lineChartXLabel = lineChart
			.append("text")
			.text(butXLabel.value)
			.attr("x", x(0) + 50)
			.attr("y", 37 - y[0](rangeMin[0]))
		var lineChartYLabel2 = lineChart
			.append("text")
			.text(butYLabel.value)
			.attr("x", x(0) - 30)
			.attr("y", -1 * y[0](rangeMax[0]) - 25)
		var lineChartYLabel = lineChart.selectAll(".yLabel");
		var lineChartYTicks = lineChart.selectAll(".yTicks")
		function generateYLabel() {
			lineChartYLabel.remove();
			lineChartYLabel = lineChart.selectAll(".yLabel")
				.data(function(){
					if (ils == lineSelect)
						return y[lineSelect].ticks(4)
					else
						return 0;
				})
				.enter().append("text")
				.attr("class", "yLabel")
				.text(String)
				.attr("x", m - 30)
				.attr("y", function(d) { return -1 * y[ils](d) })
				.attr("text-anchor", "right")
				.attr("dy", 4)
		}
		function generateYTicks() {
			lineChartYTicks.remove();
			lineChartYTicks = lineChart.selectAll(".yTicks")
			.data(y[0].ticks(yyTicks))
			.enter().append("line")
			.attr("class", "yTicks")
			.attr("y1", function(d) { return -1 * y[0](d); })
			.attr("x1", x(0))
			.attr("y2", function(d) { return -1 * y[0](d); })
			.attr("x2", m + 20)
			.style("stroke", axisC)
		}
		generateYLabel();
		generateYTicks();
		//Generate Logo
		lineChartIntro.append("line")
			.attr("x1", x(0))
			.attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", x(0))
			.attr("y2", -1 * y[0]((rangeMax[0] - rangeMin[0]) * 35 / 100 + rangeMin[0]))
			.style("stroke", "url(#tempGradient)")
			.style("stroke-width", 5)
			.transition()
			.duration(2000)
			.attr("x1", x(1))
			.attr("y1", -1 * y[0](2 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]))
			.attr("x2", x(3))
			.attr("y2", -1 * y[0](2 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]));
		lineChartIntro.append("line")
			.attr("x1", x(0))
			.attr("y1", -1 * y[0]((rangeMax[0] - rangeMin[0]) * 35 / 100 + rangeMin[0]))
			.attr("x2", x(0))
			.attr("y2", -1 * y[0]((rangeMax[0] - rangeMin[0]) * 70 / 100 + rangeMin[0]))
			.style("stroke", "url(#tempGradient)")
			.style("stroke-width", 5)
			.transition()
			.duration(2000)
			.attr("x1", x(1))
			.attr("y1", -1 * y[0](2 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]))
			.attr("x2", x(1))
			.attr("y2", -1 * y[0](3 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]));
		lineChartIntro.append("line")
			.attr("x1", x(0))
			.attr("y1", -1 * y[0]((rangeMax[0] - rangeMin[0]) * 70 / 100 + rangeMin[0]))
			.attr("x2", x(0))
			.attr("y2", -1 * y[0]((rangeMax[0] - rangeMin[0]) + rangeMin[0]))
			.style("stroke", "url(#tempGradient)")
			.style("stroke-width", 5)
			.transition()
			.duration(2000)
			.attr("x1", x(1))
			.attr("y1", -1 * y[0](3 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]))
			.attr("x2", x(3))
			.attr("y2", -1 * y[0](3 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]));
		lineChartIntro.append("line")
			.attr("x1", x(0))
			.attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", x(1))
			.attr("y2", -1 * y[0](rangeMin[0]))
			.style("stroke", "url(#tempGradient)")
			.style("stroke-width", 5)
			.transition()
			.duration(2000)
			.attr("x1", x(1))
			.attr("y1", -1 * y[0]((rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]))
			.attr("x2", x(3))
			.attr("y2", -1 * y[0]((rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]));
		lineChartIntro.append("line")
			.attr("x1", x(1))
			.attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", x(2))
			.attr("y2", -1 * y[0](rangeMin[0]))
			.style("stroke", "url(#tempGradient)")
			.style("stroke-width", 5)
			.transition()
			.duration(2000)
			.attr("x1", x(3))
			.attr("y1", -1 * y[0]((rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]))
			.attr("x2", x(3))
			.attr("y2", -1 * y[0](2 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]));
		lineChartIntro.append("line")
			.attr("x1", x(2))
			.attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", x(3))
			.attr("y2", -1 * y[0](rangeMin[0]))
			.style("stroke", "url(#lightGradient)")
			.style("stroke-width", 5)
			.transition()
			.duration(2000)
			.attr("x1", x(4))
			.attr("y1", -1 * y[0]((rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]))
			.attr("x2", x(4))
			.attr("y2", -1 * y[0](4 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]));
		lineChartIntro.append("line")
			.attr("x1", x(3))
			.attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", x(4))
			.attr("y2", -1 * y[0](rangeMin[0]))
			.style("stroke", "url(#lightGradient)")
			.style("stroke-width", 5)
			.transition()
			.duration(2000)
			.attr("x1", x(4))
			.attr("y1", -1 * y[0]((rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]))
			.attr("x2", x(6))
			.attr("y2", -1 * y[0]((rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]));
		lineChartIntro.append("line")
			.attr("x1", x(4))
			.attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", x(4))
			.attr("y2", -1 * y[0](rangeMin[0]))
			.style("stroke", "url(#soundGradient)")
			.style("stroke-width", 5)
			.transition()
			.duration(2000)
			.attr("x1", x(7))
			.attr("y1", -1 * y[0](3 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]))
			.attr("x2", x(9))
			.attr("y2", -1 * y[0](3 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]));
		lineChartIntro.append("line")
			.attr("x1", x(4))
			.attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", x(5))
			.attr("y2", -1 * y[0](rangeMin[0]))
			.style("stroke", "url(#soundGradient)")
			.style("stroke-width", 5)
			.transition()
			.duration(2000)
			.attr("x1", x(7))
			.attr("y1", -1 * y[0]((rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]))
			.attr("x2", x(7))
			.attr("y2", -1 * y[0](3 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]));
		lineChartIntro.append("line")
			.attr("x1", x(5))
			.attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", x(6))
			.attr("y2", -1 * y[0](rangeMin[0]))
			.style("stroke", "url(#soundGradient)")
			.style("stroke-width", 5)
			.transition()
			.duration(2000)
			.attr("x1", x(7))
			.attr("y1", -1 * y[0]((rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]))
			.attr("x2", x(9))
			.attr("y2", -1 * y[0]((rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]));
		lineChartIntro.append("line")
			.attr("x1", x(6))
			.attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", x(7))
			.attr("y2", -1 * y[0](rangeMin[0]))
			.style("stroke", "url(#soundGradient)")
			.style("stroke-width", 5)
			.transition()
			.duration(2000)
			.attr("x1", x(8))
			.attr("y1", -1 * y[0](2 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]))
			.attr("x2", x(9))
			.attr("y2", -1 * y[0](2 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]));
		lineChartIntro.append("line")
			.attr("x1", x(7))
			.attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", x(8))
			.attr("y2", -1 * y[0](rangeMin[0]))
			.style("stroke", "url(#soundGradient)")
			.style("stroke-width", 5)
			.transition()
			.duration(2000)
			.attr("x1", x(9))
			.attr("y1", -1 * y[0](2 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]))
			.attr("x2", x(9))
			.attr("y2", -1 * y[0](3 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]));
		lineChartIntro.append("line")
			.attr("x1", x(8))
			.attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", x(9))
			.attr("y2", -1 * y[0](rangeMin[0]))
			.style("stroke", "Red")
			.style("stroke-width", 5)
			.transition()
			.duration(2000)
			.attr("x1", x(10))
			.attr("y1", -1 * y[0](3 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]))
			.attr("x2", x(12))
			.attr("y2", -1 * y[0](3 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]));
		lineChartIntro.append("line")
			.attr("x1", x(9))
			.attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", x(9))
			.attr("y2", -1 * y[0](rangeMin[0]))
			.style("stroke", "Red")
			.style("stroke-width", 5)
			.transition()
			.duration(2000)
			.attr("x1", x(12))
			.attr("y1", -1 * y[0](2 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]))
			.attr("x2", x(12))
			.attr("y2", -1 * y[0](3 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]));
		lineChartIntro.append("line")
			.attr("x1", x(9))
			.attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", x(10))
			.attr("y2", -1 * y[0](rangeMin[0]))
			.style("stroke", "Red")
			.style("stroke-width", 5)
			.transition()
			.duration(2000)
			.attr("x1", x(10))
			.attr("y1", -1 * y[0]((rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]))
			.attr("x2", x(12))
			.attr("y2", -1 * y[0]((rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]));
		lineChartIntro.append("line")
			.attr("x1", x(10))
			.attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", x(11))
			.attr("y2", -1 * y[0](rangeMin[0]))
			.style("stroke", "Red")
			.style("stroke-width", 5)
			.transition()
			.duration(2000)
			.attr("x1", x(11))
			.attr("y1", -1 * y[0](2 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]))
			.attr("x2", x(12))
			.attr("y2", -1 * y[0](2 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]));
		lineChartIntro.append("line")
			.attr("x1", x(11))
			.attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", x(12))
			.attr("y2", -1 * y[0](rangeMin[0]))
			.style("stroke", "Red")
			.style("stroke-width", 5)
			.transition()
			.duration(2000)
			.attr("x1", x(10))
			.attr("y1", -1 * y[0]((rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]))
			.attr("x2", x(10))
			.attr("y2", -1 * y[0](3 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]));
		lineChartIntro.append("line")
			.attr("x1", x(12))
			.attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", x(13))
			.attr("y2", -1 * y[0](rangeMin[0]))
			.style("stroke", "Blue")
			.style("stroke-width", 5)
			.transition()
			.duration(2000)
			.attr("x1", x(15))
			.attr("y1", -1 * y[0]((rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]))
			.attr("x2", x(15))
			.attr("y2", -1 * y[0](3 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]));
		lineChartIntro.append("line")
			.attr("x1", x(13))
			.attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", x(14))
			.attr("y2", -1 * y[0](rangeMin[0]))
			.style("stroke", "Blue")
			.style("stroke-width", 5)
			.transition()
			.duration(2000)
			.attr("x1", x(13))
			.attr("y1", -1 * y[0](3 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]))
			.attr("x2", x(15))
			.attr("y2", -1 * y[0](3 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]));
		lineChartIntro.append("line")
			.attr("x1", x(14))
			.attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", x(14))
			.attr("y2", -1 * y[0](rangeMin[0]))
			.style("stroke", "Blue")
			.style("stroke-width", 5)
			.transition()
			.duration(2000)
			.attr("x1", x(13))
			.attr("y1", -1 * y[0]((rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]))
			.attr("x2", x(15))
			.attr("y2", -1 * y[0]((rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]));
		lineChartIntro.append("line")
			.attr("x1", x(14))
			.attr("y1", -1 * y[0](rangeMin[0]))
			.attr("x2", x(15))
			.attr("y2", -1 * y[0](rangeMin[0]))
			.style("stroke", "Blue")
			.style("stroke-width", 5)
			.transition()
			.duration(2000)
			.attr("x1", x(13))
			.attr("y1", -1 * y[0](-((rangeMax[0] - rangeMin[0]) / 10) + rangeMin[0]))
			.attr("x2", x(13))
			.attr("y2", -1 * y[0](3 * (rangeMax[0] - rangeMin[0]) / 5 + rangeMin[0]));
		$(mainChartDiv).append(belowChart);
		butDomain.value = sizeOfDomain; //Declare the buttons' values
		butAxisC.value = axisC;
		butAxisW.value = axisW;
		butPathC.value = "";
		buth.value = h;
		butw.value = w;
		butm.value = m;
		butYTicks.value = yyTicks;
		butValues.value = values;
		butRangeMin.value = rangeMin[0];
		butRangeMax.value = rangeMax[0];
		butSelectAll.onclick = function(){selectAllPaths = true; eachPathData.forEach(LINECHART.lineSelected);}
		butCircleSize.disabled = true; //Disable all of the buttons
		butCircleColor.disabled = true;
		butPathW.disabled = true;
		butPathC.disabled = true;
		butCirclesOnOff.disabled = true;
		butPathOnOff.disabled = true;
		butSharpSmooth.disabled = true;
		butFill.disabled = true;
		butSelectAll.disabled = true;
		LINECHART.createUserInterface = function(){
			var bisectDate = d3.bisector(function(d) { return d.data2; }).left; //Hover Values
			var focus = vis.append("g")
				.attr("class", "focus")
				.style("display", "none");
			focus.append("circle")
				.attr("r", sizeOfCircles[lineSelect] * 2.25);
			focus.append("text")
				.attr("x", 9)
				.attr("dy", ".35em");
			userInterface = vis.append("rect")
				.attr("class", "overlay")
				.attr("width", w)
				.attr("height", h)
				.on("mouseover", function() { focus.style("display", null); })
				.on("mousedown", downTheMouse)
				.on("mouseout", function() { focus.style("display", "none"); })
				.on("mousemove", mousemove);
			function mousemove() { //Mouseover Function
				if (selectAllPaths == false)
				{
					focus.style("display", null);
					XpageX = (sizeOfDomain) / (w-m) * (ePageX - m - 9);
					YpageY = 100 - (ePageY - m - 89)  / (h-m*2) * (values/sizeOfDomain);
					pageYFixed = YpageY.toFixed(Math.floor(values/sizeOfDomain/10).toString().length);
					pageXFixed = XpageX.toFixed(Math.floor(values/sizeOfDomain/10).toString().length);
					//if (displayPoints[lineSelect][(pageXFixed - 1)*(values/sizeOfDomain)] != null
					//	&& timeAtPoint[lineSelect][(pageXFixed - 2) * (values/sizeOfDomain)] != null)
					//{
					if (isNaN(data2Times[lineSelect]) == true) {
						data2Times[lineSelect] = []
					}
					for (var i = 0; i <= sizeOfDomain; i++) {
						data2Times[lineSelect][i] = new Date(data2[lineSelect][i]);
					}
					inputTextY = ( ( ((y[lineSelect](data[lineSelect][Math.round(XpageX)]) - m - 89)  / (h-m*2) * (100))
						+ (25.42857142857143*(350/(h-m*2)))) * (rangeMax[lineSelect] - rangeMin[lineSelect]) / 100
						+ rangeMin[lineSelect] ).toFixed(2);
					$('#status').html( data2Times[lineSelect][Math.round(XpageX)].toTimeString()
						+', '+ inputTextY + endString[lineSelect]);
					focus.attr("transform", "translate(" + (Math.round(XpageX) * ((w - m)/sizeOfDomain) + m)
						+ "," + y[lineSelect]((rangeMax[lineSelect] - data[lineSelect][Math.round(XpageX)])
						+ rangeMin[lineSelect])  + ")");
					focus.select("text").text( data2Times[lineSelect][Math.round(XpageX)].toTimeString().substring(0, 8)
						+', '+ inputTextY + endString[lineSelect]).attr("transform", "translate(10, 10)");
					//}
				}
				else
				{
					$('#status').html("");
					focus.style("display", "none");
				}
			}
			function downTheMouse() { //Mouse- Click Function
				if (selectAllPaths == false)
				{
					focus.style("display", null);
					if (data2Times[lineSelect][Math.round(XpageX)] != null && inputTextY != null)
						$('#clickedStatus').html( data2Times[lineSelect][Math.round(XpageX)]
							+ ", " + inputTextY + endString[lineSelect]);
					else
						$('#clickedStatus').html("Error.. Try again");
				}
				else
				{
					$('#clickedStatus').html("");
					focus.style("display", "none");
				}
			}
		}
		//Selection Functions
		LINECHART.domainSize = function(e){
			if (e.keyCode == 13) {
				if (isNaN(butDomain.value) == false && butDomain.value >= 1)
				{
					oldDomainSize = sizeOfDomain;
					sizeOfDomain = parseInt(butDomain.value);
					$('#selectedOption').html( "Size of Domain: " + sizeOfDomain);
					x = d3.scale.linear().domain([0, sizeOfDomain]).range([m, w])
					differenceInDomain = Math.abs(sizeOfDomain - oldDomainSize);
					eachPathData.forEach(LINECHART.newDomain);
					transitioning = "all";
					createPaths();
					appendCircles();
					transitioning = "true";
				}
				else
					$('#selectedOption').html( "Size of Domain: must be a valid number");
			}
			else
				$('#selectedOption').html( "Size of Domain: ");
		}
		LINECHART.valuesFunction = function(e){
		if (e.keyCode == 13) {
			if (isNaN(butValues.value) == false && butValues.value > sizeOfDomain + 1)
			{
				values = parseInt(butValues.value);
				$('#selectedOption').html( "Number of Values: " + values);
				transitioning = "all";
				axisCircles.remove();
				appendCircles();
				transitioning = "true";
			}
			else
				$('#selectedOption').html( "Number of Values: must be a valid number");
		}
		else
			$('#selectedOption').html( "Number of Values: ");
		}
		LINECHART.sharpSmoothFunction = function() {
			if (selectAllPaths == true)
			{
				eachPathData.forEach(ifAll);
			}
			else
			{
				ils = lineSelect; transitioning = "false";
				ifAll();
			}
			function ifAll(element, index, array) {
				if (selectAllPaths == true)
				{
					ils = index;
					transitioning = "all";
				}
				if (sharpSmooth[ils] == "linear")
				{
					sharpSmooth[ils] = "monotone";
					butSharpSmooth.value = "Sharp";
				}
				else
				{
					sharpSmooth[ils] = "linear";
					butSharpSmooth.value = "Smooth";
				}
			}
			assignPaths();
			createPaths();
			transitioning = "true";
		}
		LINECHART.circlesOnOffFunction = function() {
			if (selectAllPaths == true)
				eachPathData.forEach(ifAll);
			else
			{
				ils = lineSelect;
				transitioning = "false";
				ifAll();
			}
			function ifAll(element, index, array) {
				if (selectAllPaths == true)
				{
					ils = index;
					transitioning = "all";
				}
				if (circlesOnOff[ils] == true)
				{
					circlesOnOff[ils] = false;
					circles[ils].remove();
					butCirclesOnOff.value = "Cicles";
				}
				else
					circlesOnOff[ils] = true;
				appendCircles();
				transitioning = "true";
				butCirclesOnOff.value = "Cicles Off";
			}
		}
		LINECHART.pathOnOffFunction = function() {
			if (selectAllPaths == true)
				eachPathData.forEach(ifAll);
			else
			{
				ils = lineSelect;
				ifAll();
			}
			function ifAll(element, index, array) {
				if (selectAllPaths == true)
					ils = index;
				if (pathOnOff[ils] == true)
				{
					pathOnOff[ils] = false;
					slidePathVisibility[ils] = 0;
					butPathOnOff.value = "Path On";
				}
				else
				{
					pathOnOff[ils] = true;
					slidePathVisibility[ils] = 75;
					butPathOnOff.value = "Path Off";
				}
				paths[ils]
					.style("fill-opacity", slidePathVisibility[ils]/100)
					.style("opacity", slidePathVisibility[ils])
			}
		}
		LINECHART.circleSize = function(e) {
			if (selectAllPaths == true)
				eachPathData.forEach(ifAll);
			else
			{
				ils = lineSelect;
				ifAll();
			}
			function ifAll(element, index, array) {
				if (e.keyCode == 13)
				{
					if (selectAllPaths == true)
						ils = index;
					if (isNaN(butCircleSize.value) == false && butCircleSize.value >= 0)
					{
						sizeOfCircles[ils] = parseFloat(butCircleSize.value);
						$('#selectedOption').html( "Size of Circles: " + sizeOfCircles[ils]);
						circles[ils].transition().duration(500).attr("r", sizeOfCircles[ils])
					}
					else
						$('#selectedOption').html( "Size of Circles: must be a valid number");
				}
				else
					$('#selectedOption').html( "Size of Circles: ");
			}
		}
		LINECHART.circleColor = function(e) {
			if (selectAllPaths == true)
				eachPathData.forEach(ifAll);
			else
			{
				ils = lineSelect;
				ifAll();
			}
			function ifAll(element, index, array){
				if (e.keyCode == 13) {
					if (selectAllPaths == true)
					{
						ils = index;
					}
					if (butCircleColor.value == "default")
					{
						circlesC[ils] = "url(#tempGradient)"
						$('#selectedOption').html( "Circles Color: default");
						circles[ils].transition().duration(500).style("stroke", circlesC[ils]).style("fill", circlesC[ils])
					}
					else {
						if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test("#" + butCircleColor.value) == true)
						{
							circlesC[ils] = "#" + butCircleColor.value
							$('#selectedOption').html( "Circles Color: " + circlesC[ils]);
							circles[ils].transition().duration(500).style("stroke", circlesC[ils]).style("fill", circlesC[ils])
						}
						else
							$('#selectedOption').html( "Circles Color: must be a valid color");
					}
				}
				else
					$('#selectedOption').html( "Circles Color: 3 digit hex or 6 digit hex");
			}
		}
		LINECHART.axisCFunct = function(e){
			if (e.keyCode == 13) {
				if (butAxisC.value == "default")
				{
					axisC = "url(#tempGradient)"
					$('#selectedOption').html( "Chart Axis Color: default");
					lineChart.selectAll("line").transition().duration(500).style("stroke", axisC)
				}
				else {
					if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test("#" + butAxisC.value) == true)
					{
						axisC = "#" + butAxisC.value
						$('#selectedOption').html( "Chart Axis Color: " + axisC);
						lineChart.selectAll("line").transition().duration(500).style("stroke", axisC)
					}
					else
						$('#selectedOption').html( "Chart Axis Color: must be a valid color");
				}
			}
			else
				$('#selectedOption').html( "Chart Axis Color: 3-digit hex, 6-digit hex, or default");
		}
		LINECHART.axisWFunct = function(e) {
			if (e.keyCode == 13) {
				if (isNaN(butAxisW.value) == false && butAxisW.value >= 0)
				{
					axisW = parseFloat(butAxisW.value);
					$('#selectedOption').html( "Chart Axis Width: " + axisW);
					lineChart.selectAll("line").transition().duration(500).attr("stroke-width", axisW)
				}
				else
					$('#selectedOption').html( "Chart Axis Width: must be a valid number");
			}
			else
				$('#selectedOption').html( "Chart Axis Width: ");
		}
		LINECHART.pathC = function(e){
			if (selectAllPaths == true)
				eachPathData.forEach(ifAll);
			else
			{
				ils = lineSelect;
				ifAll();
			}
			function ifAll(element, index, array) {
				if (e.keyCode == 13) {
					if (selectAllPaths == true)
						ils = index;
					if (butPathC.value == "default")
					{
						pathColor[ils] = "url(#tempGradient)"
						$('#selectedOption').html( "Path Color: default");
						paths[ils].transition().duration(500).style("stroke", pathColor[ils]).style("fill", pathColor[ils])
					}
					else {
						if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test("#" + butPathC.value) == true)
						{
							pathColor[ils] = "#" + butPathC.value
							$('#selectedOption').html( "Path Color: " + pathColor[ils]);
							paths[ils].transition().duration(500).style("stroke", pathColor[ils]).style("fill", pathColor[ils])
						}
						else
							$('#selectedOption').html( "Path Color: must be a valid color");
					}
				}
				else
					$('#selectedOption').html( "Path Color: 3 digit hex, 6 digit hex, or default");
			}
		}
		LINECHART.pathW = function(e) {
			if (selectAllPaths == true)
				eachPathData.forEach(ifAll);
			else
			{
				ils = lineSelect;
				ifAll();
			}
			function ifAll(element, index, array) {
				if (e.keyCode == 13) {
					if (selectAllPaths == true)
						ils = index;
					if (isNaN(butPathW.value) == false && butPathW.value >= 0)
					{
						pathWidth[ils] = parseFloat(butPathW.value);
						$('#selectedOption').html( "Path Width: " + pathWidth[ils]);
						paths[ils].transition().duration(500).style("stroke-width", pathWidth[ils])
					}
					else
					$('#selectedOption').html( "Path Width: must be a valid number");
				}
				else
					$('#selectedOption').html( "Path Width: ");
			}
		}
		LINECHART.heightF = function(e) {
			if (e.keyCode == 13) {
				if (isNaN(buth.value) == false)
				{
					h = parseFloat(buth.value);
					$('#selectedOption').html( "Height: " + h);
					for (var i = 0; i < 5; i++) {
						y[i] = d3.scale.linear().domain([rangeMin[i], rangeMax[i]]).range([0 + m, h - m]);
					}
					lineChart
						.transition()
						.duration(500)
						.attr("transform", "translate(0, " + h + ")");
					lineChartPath
						.transition()
						.duration(500)
						.attr("transform", "translate(0, " + h + ")")
					lineChartPath2
						.transition()
						.duration(500)
						.attr("transform", "translate(0, " + h + ")")
					lineChartPathBegin
						.transition()
						.duration(500)
						.attr("transform", "translate(0, " + h + ")")
					lineChartIntro
						.transition()
						.duration(500)
						.attr("transform", "translate(0, " + h + ")")
					lineChartYLabel
						.transition()
						.duration(500)
						.attr("y", function(d) { return -1 * y[0](d) })
					lineChartXLine
						.transition()
						.duration(500)
						.attr("y1", -1 * y[0](rangeMin[0]))
						.attr("y2", -1 * y[0](rangeMax[0]))
					lineChartYTicks
						.transition()
						.duration(500)
						.attr("y1", function(d) { return -1 * y[0](d); })
						.attr("y2", function(d) { return -1 * y[0](d); })
					lineChartXTicks
						.transition()
						.duration(500)
						.attr("y1", -1 * y[0](rangeMin[0]))
						.attr("y2", -1 * y[0](rangeMin[0]))
					lineChartXLabel
						.transition()
						.duration(500)
						.attr("y", 37 -y[0](rangeMin[0]))
					lineChartYLabel2
						.transition()
						.duration(500)
						.attr("y", -1 * y[0](rangeMax[0]) - 25)
					transitioning = "all";
					assignPaths();
					appendCircles();
					transitioning = "true";
					$('.chartSVG').height(h + m);
				}
				else
					$('#selectedOption').html( "Height: must be a valid number");
			}
			else
				$('#selectedOption').html( "Height: ");
		}
		LINECHART.widthF = function(e){
			if (e.keyCode == 13) {
				if (isNaN(butw.value) == false)
				{
					w = parseFloat(butw.value);
					$('#selectedOption').html( "Width: " + w);
					x = d3.scale.linear().domain([0, sizeOfDomain]).range([m, w])
					lineChartYLabel
						.transition()
						.duration(500)
						.attr("x", m - 30)
						.attr("dy", 4)
					lineChartXLine
						.transition()
						.duration(500)
						.attr("x1", x(0))
						.attr("x2", x(0))
					lineChartYTicks
						.transition()
						.duration(500)
						.attr("x1", x(0))
						.attr("x2", m + 20)
					lineChartXTicks
						.transition()
						.duration(500)
						.attr("x1", x(0))
						.attr("x2", x(sizeOfDomain))
					lineChartXLabel
						.transition()
						.duration(500)
						.attr("x", x(0) + 50)
					lineChartYLabel2
						.transition()
						.duration(500)
						.attr("x", x(0) - 30)
					transitioning = "all";
					assignPaths();
					appendCircles();
					transitioning = "true";
					$('.chartSVG').width(w + m);
				}
				else
					$('#selectedOption').html( "Width: must be a valid number");
			}
			else
				$('#selectedOption').html( "Width: ");
		}
		LINECHART.marginF = function(e) {
			if (e.keyCode == 13) {
				if (isNaN(butm.value) == false && butm.value >= 0)
				{
					m = parseFloat(butm.value);
					$('#selectedOption').html( "Margin: " + m);
					x = d3.scale.linear().domain([0, sizeOfDomain]).range([m, w]);
					for (var i = 0; i < 5; i++) {
						y[i] = d3.scale.linear().domain([rangeMin[i], rangeMax[i]]).range([0 + m, h - m]);
					}
					lineChartYLabel
						.transition()
						.duration(500)
						.attr("x", m - 30)
						.attr("y", function(d) { return -1 * y[0](d) })
						.attr("dy", 4)
					lineChartXLine
						.transition()
						.duration(500)
						.attr("x1", x(0))
						.attr("y1", -1 * y[0](rangeMin[0]))
						.attr("x2", x(0))
						.attr("y2", -1 * y[0](rangeMax[0]))
					lineChartYTicks
						.transition()
						.duration(500)
						.attr("y1", function(d) { return -1 * y[0](d); })
						.attr("x1", x(0))
						.attr("y2", function(d) { return -1 * y[0](d); })
						.attr("x2", m + 20)
					lineChartXTicks
						.transition()
						.duration(500)
						.attr("x1", x(0))
						.attr("y1", -1 * y[0](rangeMin[0]))
						.attr("x2", x(sizeOfDomain))
						.attr("y2", -1 * y[0](rangeMin[0]))
					lineChartXLabel
						.transition()
						.duration(500)
						.attr("x", x(0) + 50)
						.attr("y", 37 -y[0](rangeMin[0]))
					lineChartYLabel2
						.transition()
						.duration(500)
						.attr("x", x(0) - 30)
						.attr("y", -1 * y[0](rangeMax[0]) - 25)
					transitioning = "all";
					assignPaths();
					appendCircles();
					transitioning = "true";
					$('.chartSVG').width(w + m).height(h + m);
				}
				else
				$('#selectedOption').html( "Margin: must be a valid number");
			}
			else
			$('#selectedOption').html( "Margin: ");
		}
		LINECHART.rangeMinF = function(e) {
			if (e.keyCode == 13) {
				if (isNaN(butRangeMin.value) == false && butRangeMin.value <= rangeMax[lineSelect])
				{
					rangeMin[lineSelect] = parseFloat(butRangeMin.value);
					$('#selectedOption').html( "Range Minimum: " + rangeMin[lineSelect]);
					y[lineSelect] = d3.scale.linear().domain([rangeMin[lineSelect], rangeMax[lineSelect]]).range([0 + m, h - m]);
					generateYLabel();
					generateYTicks();
					lineChartXLine
						.transition()
						.duration(500)
						.attr("y1", -1 * y[0](rangeMin[0]))
					lineChartXTicks
						.transition()
						.duration(500)
						.attr("y1", -1 * y[0](rangeMin[0]))
						.attr("y2", -1 * y[0](rangeMin[0]))
					lineChartYLabel2
						.transition()
						.duration(500)
						.attr("y", 37 - y[0](rangeMin[0]))
					transitioning = "false";
					assignPaths();
					appendCircles();
					paths[lineSelect].transition().duration(500).attr("d", line)
					transitioning = "all";
				}
				else
					$('#selectedOption').html( "Range Minimum: must be a valid number lower than the range maximum");
			}
			else
				$('#selectedOption').html( "Range Minimum: ");
		}
		LINECHART.rangeMaxF = function(e) {
			if (e.keyCode == 13) {
				if (isNaN(butRangeMax.value) == false && butRangeMax.value >= rangeMin[lineSelect])
				{
					rangeMax[lineSelect] = parseFloat(butRangeMax.value);
					$('#selectedOption').html( "Range Maximum: " + rangeMax[lineSelect]);
					y[lineSelect] = d3.scale.linear().domain([rangeMin[lineSelect], rangeMax[lineSelect]]).range([0 + m, h - m]);
					generateYLabel();
					generateYTicks();
					lineChartXLine
						.transition()
						.duration(500)
						.attr("y2", -1 * y[0](rangeMax[0]))
					lineChartXLabel
						.transition()
						.duration(500)
						.attr("x", x(0) + 50)
						.attr("y", 37 -y[0](rangeMin[0]))
					transitioning = "false";
					assignPaths();
					appendCircles();
					paths[lineSelect].transition().duration(500).attr("d", line)
					transitioning = "all";
				}
				else
					$('#selectedOption').html( "Range Maximum: must be a valid number higher than the range minimum");
			}
			else
				$('#selectedOption').html( "Range Maximum: ");
		}
		LINECHART.xLabel = function(e){
			if (e.keyCode == 13) {
				$('#selectedOption').html( "X Label: " + butXLabel.value);
				lineChartXLabel
					.text(butXLabel.value)
			}
			else
				$('#selectedOption').html( "X Label: " + butXLabel.value);
		}
		LINECHART.yLabel = function(e){
			if (e.keyCode == 13) {
				$('#selectedOption').html( "Y Label: " + butYLabel.value);
				lineChartYLabel2
					.text(butYLabel.value)
			}
			else
				$('#selectedOption').html( "Y Label: " + butYLabel.value);
		}

		LINECHART.yyTicksF = function(e){
			if (e.keyCode == 13) {
				if (isNaN(butYTicks.value) == false && butYTicks.value >= 0)
				{
					yyTicks = parseInt(butYTicks.value);
					$('#selectedOption').html( "Ticks: " + yyTicks);
					lineChartYTicks.remove();
					lineChartYTicks = lineChart.selectAll(".yTicks")
					.data(y[0].ticks(yyTicks))
					.enter().append("line")
					.attr("class", "yTicks")
					.attr("y1", function(d) { return -1 * y[0](d); })
					.attr("x1", x(0))
					.attr("y2", function(d) { return -1 * y[0](d); })
					.attr("x2", m + 20)
					.style("stroke", axisC)
				}
				else
					$('#selectedOption').html( "Ticks: must be a valid number");
			}
			else
				$('#selectedOption').html( "Ticks: ");
		}
		LINECHART.fillFunction = function() {
			if (selectAllPaths == true)
				eachPathData.forEach(ifAll);
			else
			{
				ils = lineSelect;
				transitioning = "false";
				ifAll();
			}
			function ifAll(element, index, array) {
				if (selectAllPaths == true)
				{
					ils = index;
					transitioning = "all";
				}
				if (fill[ils] == true)
				{
					fill[ils] = false;
					butFill.value = "Fill";
				}
				else
				{
					fill[ils] = true;
					butFill.value = "Fill Off";
				}
				assignPaths();
				createPaths();
				transitioning = "true";
			}
		}
		//Changing the Domain Size
		LINECHART.newDomain = function(element, index, array){
			oldData[index] = data[index]
			if (sizeOfDomain > oldDomainSize)
			{
				for (var i = 0; i < oldDomainSize; i++)
					data[index][i + differenceInDomain] = oldData[index][i]
				for (var i = 0; i < differenceInDomain; i++)
					data[index][i] = rangeMin[0];
			}
			else
			{
				data[index] = new Array();
				for (var i = 0; i < sizeOfDomain; i++)
					data[index][i] = oldData[index][i + differenceInDomain]
			}
		}
		//Give each path a selector button
		LINECHART.lineSelected = function(element2, all, array2){
			ils = lineSelect
			$('#lineButtons').html("");
			for (var i = 0; i < eachPathData.length; i++)
			{
				$('#lineButtons').append("<input type='button' onclick='LINECHART.changeLineSelected("
					+ i + "); LINECHART.ils = LINECHART.lineSelect; LINECHART.unselectPaths(); LINECHART.lineSelected()' value='"
					+ data_type[i] + "'></input>");
			}
			if (selectAllPaths == true)
			{
				ils = all;
				$('#lineButtons').append(" You currently have Path every path selected");
			}
			else
			{
				$('#lineButtons').append(" You currently have Path"+ (lineSelect + 1) +" selected");
				butCircleSize.value = sizeOfCircles[lineSelect];
				butCircleColor.value = circlesC[lineSelect];
				butPathC.value = pathColor[lineSelect];
				butPathW.value = pathWidth[lineSelect];
				butRangeMin.value = rangeMin[lineSelect];
				butRangeMax.value = rangeMax[lineSelect];
				if (circlesOnOff[lineSelect] == true)
					butCirclesOnOff.value = "Circles Off";
				else
					butCirclesOnOff.value = "Circles";
				if (pathOnOff[lineSelect] == true)
					butPathOnOff.value = "Path Off";
				else
					butPathOnOff.value = "Path On";
				if (sharpSmooth[lineSelect] == "Monotone")
					butSharpSmooth.value = "Smooth";
				else
					butSharpSmooth.value = "Sharp"
				if (fill[lineSelect] == true)
					butFill.value = "Fill Off";
				else
					butFill.value = "Fill"
			}
			generateYLabel();
			$('#selectedOption').html( "");
			paths[ils]
				.transition().duration(200).style("stroke", "red").style("stroke-width", pathWidth[ils]*1.5)
				.transition().duration(200).style("stroke", pathColor[ils]).style("stroke-width", pathWidth[ils]);
			circles[ils]
				.transition().duration(200).style("stroke", "red").style("fill", "red").attr("r", sizeOfCircles[ils]*2)
				.transition().duration(200).style("stroke", circlesC[ils]).style("fill", circlesC[ils]).attr("r", sizeOfCircles[ils])
		}
		//When start button is pressed
		LINECHART.Start = function()
		{
			lineChartIntro.selectAll("line") //Sink the Deep Logo
				.transition()
				.duration(2000)
				.attr("y1", -1 * y[0](rangeMin[0]))
				.attr("y2", -1 * y[0](rangeMin[0]))
				.transition()
				.duration(1000)
				.style("stroke-width", 1)
				.attr("x1", x(0))
				.attr("x2", x(sizeOfDomain))
				.remove();
			if (isNaN(newDataIn[0]) == false)
			{
				$('#lineButtons').html("")
				startMain();
				renderGraph = true;
			}
		}
		//Graph-Rendering Function
		function startMain()
		{
			generateYLabel();
			lineChartXLabel = lineChart
				.append("text")
				.text(theXLabel)
				.attr("x", x(0) + 50)
				.attr("y", 37 -y[0](rangeMin[0]))
			lineChartYLabel2 = lineChart
				.append("text")
				.text(theYLabel)
				.attr("x", x(0) - 30)
				.attr("y", -1 * y[0](rangeMax[0]) - 25)
			eachPathData.forEach(makeEachPathStart);
		}
		//Edit the paths
		function makeEachPathStart(element, index, array) {
			console.log(index);
			ils = index;
			pathOnOff[index] = pathOnOffDefault;
			circlesOnOff[index] = circleOnOffDefault;
			sharpSmooth[index] = sharpSmoothDefault;
			fill[index] = fillDefault;
			if(pathWidth[index] == null){
				pathWidth[index] = 2;
			}
			if(sizeOfCircles[index] == null){
				sizeOfCircles[index] = 2;
			}
			if(pathOnOff[index] == null){
				pathOnOff[index] = true;
			}
			if(circlesOnOff[index] == null){
				circlesOnOff[index] = false;
			}
			if(sharpSmooth[index] == null){
				sharpSmooth[index] = "monotone";
			}
			if(fill[index] == null){
				fill[index] = false;
			}
			if(slidePathVisibility[index] == null){
				slidePathVisibility[index] = 75;
			}
			if(circlesC[index] == null){
                if(index == 0){
                    circlesC[index] = 'url(#tempGradient)';
                }
                else if(index == 1){
                    circlesC[index] = 'url(#lightGradient)';
                }
                else if(index == 2){
                    circlesC[index] = 'url(#soundGradient)';
                }
                else if(index == 3){
                    circlesC[index] = 'Red';
                }
                else if(index == 4){
                    circlesC[index] = 'Blue';
                }
            }
			if(pathColor[index] == null){
				if(index == 0){
					pathColor[index] = 'url(#tempGradient)';
				}
				else if(index == 1){
					pathColor[index] = 'url(#lightGradient)';
				}
				else if(index == 2){
					pathColor[index] = 'url(#soundGradient)';
				}
				else if(index == 3){
					pathColor[index] = 'Red';
				}
				else if(index == 4){
					pathColor[index] = 'Blue';
				}
			}
			$('#lineButtons').append("<input type='button' onclick='LINECHART.changeLineSelected(" + index + "); LINECHART.ils = LINECHART.lineSelect; LINECHART.unselectPaths(); LINECHART.lineSelected()' value='" + data_type[index] + "'></input>");
			vis.each(Everything);
			function Everything (){
			thisIsEverything = d3.select(this);
			//-----------------------All of the following functions repeat-------------------------

			(function totalEverythingRepeat() {
			thisIsEverything = thisIsEverything.transition()

			//Only allow processes to continue when data comes in
			if (newDataIn[index] == true)
			{
			if (oldEachPathDataLength < eachPathData.length)
			{
				Start();
			}
			oldEachPathDataLength = eachPathData.length;

			//----------------------------------------Remove Old SVG / Reassign Values-------------------------------------------

			newDataIn[index] = false;
			d[index] = timeIn; //Assign the time
			var timePassed = d[index] - oldD[index];
			timetocompleteoneshift[index] = timePassed / 2;
			if (timetocompleteoneshift[index] > 4000 || isNaN(timetocompleteoneshift) == true)
			timetocompleteoneshift[index] = 4000;
			//console.log("\n" + timePassed + " milliseconds");
			oldD[index] = d[index];
			assignPaths = function() { //Assigning Paths
				if (transitioning == "true")
				{
					ils = index;
					assignAll();
				}
				if (transitioning == "false")
				{
					ils = lineSelect;
					assignAll();
				}
				if (transitioning == "all")
					eachPathData.forEach(assignAll);
				function assignAll(element2, all, array2) {
					if (transitioning == "all")
						ils = all;
					if (fill[ils] == true){
						lineBegin = d3.svg.area()
							.x(function(d,i) { return x(sizeOfDomain); })
							.y0(-1 * y[ils](rangeMin[ils]))
							.y1(-1 * y[ils](data[ils][sizeOfDomain - 1]))
						lineBegin2 = d3.svg.area()
							.x(function(d,i) { return x(i) + w - m - (w - m) / sizeOfDomain; })
							.y0(-1 * y[ils](rangeMin[ils]))
							.y1(function(d,i) { return -1 * y[ils](data[ils][sizeOfDomain - 2 + i]); })
						line = d3.svg.area()
							.x(function(d,i) { return x(i + 1); })
							.y0(-1 * y[ils](rangeMin[ils]))
							.y1(function(d,i) { return -1 * y[ils](data[ils][i]); })
							.interpolate(sharpSmooth[ils]);
						lineV2 = d3.svg.area()
							.x(function(d,i) { return x(i); })
							.y0(-1 * y[ils](rangeMin[ils]))
							.y1(function(d,i) { return -1 * y[ils](data[ils][i]); })
							.interpolate(sharpSmooth[ils]);
					}
					else
					{
						lineBegin = d3.svg.area()
							.x(function(d,i) { return x(sizeOfDomain); })
							.y(-1 * y[ils](data[ils][sizeOfDomain - 1]))
						lineBegin2 = d3.svg.area()
							.x(function(d,i) { return x(i) + w - m - (w - m) / sizeOfDomain; })
							.y(function(d,i) { return -1 * y[ils](data[ils][sizeOfDomain - 2 + i]); })
						line = d3.svg.area()
							.x(function(d,i) { return x(i + 1); })
							.y(function(d,i) { return -1 * y[ils](data[ils][i]); })
							.interpolate(sharpSmooth[ils]);
						lineV2 = d3.svg.area()
							.x(function(d,i) { return x(i); })
							.y(function(d,i) { return -1 * y[ils](data[ils][i]); })
							.interpolate(sharpSmooth[ils]);
					}
					if (transitioning == "all")
					{
						paths[all].transition().duration(500).attr("d", line)
					}
				}
			}
			assignPaths();
			createPaths = function(){ //Recreate paths
			if (transitioning == "true")
			{
				ils = index;
				createAll();
			}
			if (transitioning == "false")
			{
				ils = lineSelect;
				createAll();
			}
			if (transitioning == "all")
				eachPathData.forEach(createAll);
			function createAll(element2, all, array2) {
				if (transitioning == "all")
					ils = all;
				paths[ils].remove();
console.log("yea0");
				paths[ils] = linesPath
					.data([0])
					.enter().insert("path")
					.datum(data[ils])
					.attr("class", "line")
					.attr("d", line)
					.style("stroke",pathColor[ils])
					.style("stroke-width",pathWidth[ils])
					.style("fill", pathColor[ils])
					.style("fill-opacity", slidePathVisibility[ils]/100)
					.style("opacity", slidePathVisibility[ils])
					.each(slidePath);
console.log("yea4");
				}
			}
			createPaths();
			butCircleSize.disabled = false; //Change button settings
			butCircleColor.disabled = false;
			butPathW.disabled = false;
			butPathC.disabled = false;
			butCirclesOnOff.disabled = false;
			butPathOnOff.disabled = false;
			butSharpSmooth.disabled = false;
			butFill.disabled = false;
			butSelectAll.disabled = false;
			function slidePath() {
				if (transitioning == "true")
				{
					var scrollingPath = d3.select(this);
					scrollingPath = scrollingPath.transition()
						.duration(timetocompleteoneshift[index] / 32)
					scrollingPath = scrollingPath.transition()
						.duration(timetocompleteoneshift[index] / 32)
						.attr("d", line)
					scrollingPath = scrollingPath.transition()
						.duration(timetocompleteoneshift[index] / 16)
					scrollingPath = scrollingPath.transition()
						.duration(timetocompleteoneshift[index] / 8)
						.attr("d", lineV2)
					scrollingPath = scrollingPath.transition()
						.duration(timetocompleteoneshift[index] * 3 / 4)
				}
			}
			appendCircles = function() {
			if (transitioning == "true")
			{
				ils = index;
				eachCircle();
			}
			if (transitioning == "false")
			{
				ils = lineSelect;
				eachCircle();
			}
			if (transitioning == "all")
				eachPathData.forEach(eachCircle);
			function eachCircle(element2, all, array2){
			if (transitioning == "all")
				ils = all;
			circles[ils].remove();
			if (circlesOnOff[ils] == true){
					circles[ils] = axisCircles
						.data(data[ils])
						.enter().append("circle")
						.attr("r", sizeOfCircles[ils])
						.attr("cx", function(d,i) { return x(i + 1); })
						.attr("cy", function(d,i) { return y[ils](rangeMax[ils] + rangeMin[ils] - data[ils][i]); })
						.style("stroke", circlesC[ils])
						.style("fill", circlesC[ils])
						.each(function(){
							var theseCircles = d3.select(this);
							theseCircles = theseCircles.transition().duration(timetocompleteoneshift[ils]/2);
							theseCircles = theseCircles.transition().duration(timetocompleteoneshift[ils]/2);
						});
			}
			}
			}
			if (circlesOnOff[index] == true)
				appendCircles();
			LINECHART.createUserInterface();
			$(mainChartDiv).append(belowChart);
			}
			thisIsEverything.each("start", totalEverythingRepeat); })();
			}
			}
		}
	};
})();
