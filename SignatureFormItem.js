isc.defineClass("SignatureField", "Canvas").addProperties({
	autoDraw: false,
	height: 100,
	width: "100%",
	initWidget: function () {
		this.Super("initWidget", arguments);

		this.addAutoChild("signature");
		this.addAutoChild("buttonContainer", {
			members: [
			this.addAutoChild("undoButton"),
			this.addAutoChild("clearButton")
			]
		});
	},
	signatureDefaults: {
		_constructor: isc.SignatureBox,
		extraSpace: 2,
		border: "1px solid #ababab"
	},
	buttonContainerDefaults: {
		_constructor: isc.HLayout,
		height: 18,
		width: 122,
		snapTo: "TR"
	},
	undoButtonDefaults: {
		_constructor: isc.Button,
		height: 18,
		width: 60,
		extraSpace: 2,
		title: "Undo",
		click: function () {
			this.creator.signature.undo();
			if (this.creator.signature.segments.length == 0) {
				this.creator.formItem.clearValue();
			}
			return false;
		}
	},
	clearButtonDefaults: {
		_constructor: isc.Button,
		height: 18,
		width: 60,
		title: "Clear",
		click: function () {
			this.creator.signature.erase();
			this.creator.formItem.clearValue();
			return false;
		}
	}
});