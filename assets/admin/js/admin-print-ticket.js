(function ($) {

    "use strict";

    /**
     * Load print window
     */
    $(document).on('click', '.wpas-admin-quick-action-print', function (e) {

        e.preventDefault();

        var ticket_id = $(this).data('id');

        var html = '<div id="wpas-print-ticket-box">';
        html += '<a href="#" id="wpas-print-ticket-box-close"><i class="dashicons dashicons-no"></i></a>';
        html += '<div id="wpas-print-ticket-box-content">';
        html += '<h2>' + WPAS_Print.print_ticket + ' #' + ticket_id + '</h2>';
        html += '<div id="wpas-print-ticket-box-ticket-content"><img src="' + WPAS_Print.admin_url + 'images/loading.gif"></div>';
        html += '<div id="wpas-print-ticket-box-buttons">';
        html += '<a href="#" id="wpas-print-btn" class="button button-primary button-large">' + WPAS_Print.print + '</a>';
        html += '<a href="#" id="wpas-print-btn-cancel" class="button button-large">' + WPAS_Print.cancel + '</a>';
        html += '<label><input type="checkbox" id="wpas-print-toggle-replies" checked>' + WPAS_Print.include_replies + '</label>';
        html += '<label><input type="checkbox" id="wpas-print-toggle-history">' + WPAS_Print.include_history + '</label>';
        html += '<label><input type="checkbox" id="wpas-print-toggle-private-notes">' + WPAS_Print.include_private_notes + '</label>';
        html += '</div></div></div>';

        $('body').append(html);

        $.post( ajaxurl, {
            action : 'wpas_get_ticket_for_print',
            id: ticket_id,
            nonce: WPAS_Print.nonce,
            dataType: 'json'
        }).done(function( data ) {

            $('#wpas-print-ticket-box-ticket-content').html(data);

        });

    });

    /**
     * Close print window
     */
    $(document).on('click', '#wpas-print-ticket-box-close, #wpas-print-btn-cancel', function (e) {

        e.preventDefault();

        $('#wpas-print-ticket-box').fadeOut(function () {
            $(this).remove();
        });

    });

    /**
     * Toggle history
     */
    $(document).on('click', '#wpas-print-toggle-history', function (e) {

        if ( $(this).is(':checked') ) {
            $('.wpas-print-ticket-history').show();
        } else {
            $('.wpas-print-ticket-history').hide();
        }

    });

    /**
     * Toggle replies
     */
    $(document).on('click', '#wpas-print-toggle-replies', function (e) {

        if ( $(this).is(':checked') ) {
            $('.wpas-print-ticket-reply').show();
        } else {
            $('.wpas-print-ticket-reply').hide();
        }

    });

}(jQuery));