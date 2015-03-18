(function ($) {
	"use strict";

	$(function () {

		var wpEditor = (typeof tinyMCE != "undefined") && tinyMCE.activeEditor && !tinyMCE.activeEditor.isHidden();
		var data, btnEdit, btnDelete, btnCancel, btnSave, editorRow, replyId, editorId, reply, controls;

		btnEdit = $('.wpas-edit');
		btnDelete = $('.wpas-delete');
		btnCancel = $('.wpas-editcancel');
		editorRow = $('.wpas-editor');

		if (wpEditor) {

			// There is an instance of wp_editor
			btnEdit.on('click', function (event) {
				event.preventDefault();

				btnEdit = $(this);
				controls = $(this).parents('.wpas-ticket-controls');
				replyId = $(this).data('replyid');
				editorId = $(this).data('wysiwygid');
				reply = $($(this).data('origin'));
				btnSave = $('#wpas-edit-submit-' + replyId);

				// Update the UI
				controls.hide();
				reply.hide();

				/*
				Check if wp_editor has already been created
				Only do AJAX if necessary
				 */
				if ($('.wpas-editwrap-' + replyId).hasClass('wp_editor_active')) {

					$('.wpas-editwrap-' + replyId).show();

				} else {

					// AJAX data
					data = {
						'action': 'wp_editor_ajax',
						'post_id': replyId,
						'editor_id': editorId
					};

					// AJAX request
					$.post(ajaxurl, data, function (response) {
						// Append editor to DOM
						$('.wpas-editwrap-' + replyId).addClass('wp_editor_active').show();
						$('.wpas-editwrap-' + replyId + ' .wpas-wp-editor').html(response);

						// Init TinyMCE
						tinyMCE.init(tinyMCEPreInit.mceInit[data.editor_id]);

						// Init quicktags
						// Will not work because of https://core.trac.wordpress.org/ticket/26183
						try {
							quicktags(tinyMCEPreInit.qtInit[data.editor_id]);
						} catch (e) {}
					});

				}

				// Save the reply
				btnSave.on('click', function (e) {
					e.preventDefault();

					// Update the UI
					controls.show();
					btnSave.prop('disabled', true).val('Saving...');

					var tinyMCEContent = tinyMCE.get(editorId).getContent();
					var data = {
						'action': 'wpas_edit_reply',
						'reply_id': replyId,
						'reply_content': tinyMCEContent
					};

					$.post(ajaxurl, data, function (response) {
						// check if the response is an integer
						if (Math.floor(response) == response && $.isNumeric(response)) {

							// Revert to save button
							btnSave.prop('disabled', false).val('Save changes');
							reply.html(tinyMCEContent).show();
							editorRow.hide();
						} else {
							alert(response);
						}
					});
				});

				// Cancel
				btnCancel.on('click', function (e) {
					e.preventDefault();

					var data = {
						'action': 'wp_editor_content_ajax',
						'post_id': replyId
					};
					$.post(ajaxurl, data, function (response) {
						// Restore the original wp_editor content
						tinyMCE.get(editorId).setContent(response);

						// Update the UI
						reply.show();
						editorRow.hide();
						controls.show();
					});
				});
			});

			btnDelete.click(function (e) {
				if (confirm(wpasL10n.alertDelete)) {
					return true;
				} else {
					return false;
				}
			});

		} else {
			// There is NO instance of wp_editor
			alert(wpasL10n.alertNoTinyMCE);
		}

	});

}(jQuery));