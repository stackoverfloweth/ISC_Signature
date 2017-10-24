isc.defineClass("SignatureBox", "DrawPane").addProperties({
	width: "100%",
	height: "100%",
	backgroundColor: "white",
	segments: [],
	segmentIndex: 0,
	erase: function(){
		this.segments = [];
		this.segmentIndex = 0;
		this.Super("erase", arguments);
	},
	undo: function () {
		if (this.segments.length > 0) {
			var segment = this.segments[this.segments.length - 1];
			for (var i = 0; i < segment.length; i++) {
				segment[i].erase();
			}
			this.segments.splice(-1, 1);
			this.segmentIndex--;
		}
	},
	mouseMove: function () {
		if (this.shouldDraw) {
			this.currentSegment.setEndPoint(isc.Event.getX() - this.getPageLeft(), isc.Event.getY() - this.getPageTop());
			this.segments[this.segmentIndex].push(this.currentSegment);
			this.currentSegment = isc.DrawLine.create({
				drawPane: this,
				autoDraw: true,
				lineColor: "black",
				lineWidth: 3,
				startLeft: isc.Event.getX() - this.getPageLeft(),
				startTop: isc.Event.getY() - this.getPageTop(),
				endLeft: isc.Event.getX() - this.getPageLeft(),
				endTop: isc.Event.getY() - this.getPageTop()
			});
		}
	},
	mouseDown: function () {
		this.startDrawing();
	},
	mouseOut: function () {
		if (this.shouldDraw && !this.contains(isc.EventHandler.getTarget(), true)) {
			this.stopDrawing();
		}
	},
	mouseOver: function () {
		if (!this.shouldDraw && isc.Event.mouseIsDown()) {
			this.startDrawing();
		}
	},
	mouseUp: function () {
		this.stopDrawing();
	},
	startDrawing: function () {
		this.shouldDraw = true;

		this.segments.push([]);

		this.currentSegment = isc.DrawLine.create({
			drawPane: this,
			autoDraw: true,
			lineColor: "black",
			lineWidth: 3,
			startLeft: isc.Event.getX() - this.getPageLeft(),
			startTop: isc.Event.getY() - this.getPageTop(),
			endLeft: isc.Event.getX() - this.getPageLeft(),
			endTop: isc.Event.getY() - this.getPageTop()
		});
	},
	stopDrawing: function () {
		if (this.shouldDraw) {
			this.shouldDraw = false;
			this.currentSegment.setEndPoint(isc.Event.getX() - this.getPageLeft(), isc.Event.getY() - this.getPageTop());
			this.segments[this.segmentIndex].push(this.currentSegment);
			this.segmentIndex++;

			this.creator.formItem.storeValue(this.getRawValue().toDataURL());
		}
	},
	getRawValue: function () {
		return $('div[eventproxy="' + this.getID() + '"]').children().get(0);
	},
	loadSignature: function (dataURL) {
		var imageObj = new Image();
		var canvas = $('div[eventproxy="' + this.getID() + '"]').children().get(0);
		if (canvas) {
			imageObj.onload = function () {
				canvas.getContext('2d').drawImage(this, 0, 0);
			};
		}

		imageObj.src = dataURL;
	},
	saveSignature: function () {
		var rawData = this.getRawValue();
		var imageData = rawData.replace(/^data:image\/(png|jpg);base64,/, "");

		sendRequest({
			actionURL: "/service/app/application/convertsvgtopdf.ashx",
			params: {
				imageTitle: global.displayName + "'s Signature",
				imageData: imageData
			},
			useSimpleHTML: true,
			evalResult: false,
			downloadResult: true
	            //callback: function (dsResponse, data) {
	            //    //download to browser
	            //    var a = document.createElement('a');
	            //    a.href = data;
	            //    a.download = "Signature";
	            //    document.body.appendChild(a);
	            //    a.click();
	            //    document.body.removeChild(a);
	            //}
	        });
	}
});