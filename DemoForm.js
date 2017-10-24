isc.DynamicForm.create({
	width: 600,
	fields:[ {
		name: "Signature", 
		type: "CanvasItem",
		width: 600,
		editorProperties: {
			createCanvas: function (form, item) {
				var canvas = isc.SignatureField.create({
					form: form,
					formItem: item,
				});
				item.editor = canvas;
				return canvas;
			}
		}
	}
	]
});