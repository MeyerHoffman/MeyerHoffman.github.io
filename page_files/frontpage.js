$(window).load(function () {
    renderCaptions();
    captionHover();

    $(window).resize(function () {
        renderCaptions();
        captionHover();
    });

});

//-----------------------------------------
// Render Captions on homepage
//-----------------------------------------
function renderCaptions() {

    // Find all of the game caption elements
    var $gameCaption = $("#games").find(".caption");

    // Set the width for each caption overlay based on the size of the thumbnail image
    $gameCaption.each(function () {
        // Set the caption width to the thumbnail image width
        var width = $(this).parent().find("img").width();
        $(this).css({ width: width});
    });
}

function captionHover() {
    // Caption mouseover effect
    $gameCaptionParentEl = $("#games").find(".caption").parent();

    $gameCaptionParentEl.mouseenter(function () {

        // Find the caption element
        var $el = $(this).find(".caption");

        // Get and store the original height of the caption containing only the game title
        if (!$($el).data("titleHeight")) {
            var titleHeight = $($el).height() + 12;
            $($el).data("titleHeight", titleHeight);
        }

        // Expand/increase the height of the hovered caption
        $($el).animate({
            height: $($el).parent().find("img").height() + 1 + "px"
        }, 750);

    });

    $gameCaptionParentEl.mouseleave(function () {

        // Find the caption element
        var $el = $(this).find(".caption");

        // Stop the animation, start the closing animation, which will return the caption to its original height and "hide" the game information
        $($el).stop().animate({
            height: $($el).data("titleHeight") + "px"
        }, 750,function () {
            // Animation complete, hide the caption
        }).clearQueue();

    });

}

//-----------------------------------------
// Mad Mimi Form Script Functions
//-----------------------------------------
(function () {
    var form = document.getElementById('mad_mimi_signup_form'),
        submit = document.getElementById('webform_submit_button'),
        validEmail = /.+@.+\..+/,
        isValid;

    form.onsubmit = function (event) {
        validate();
        if (!isValid) {
            revalidateOnChange();
            return false;
        }
    };

    function validate() {
        isValid = true;
        emailValidation();
        fieldAndListValidation();
        updateFormAfterValidation();
    }

    function emailValidation() {
        var email = document.getElementById('signup_email');
        if (!validEmail.test(email.value)) {
            textFieldError(email);
            isValid = false;
        } else {
            removeTextFieldError(email);
        }
    }

    function fieldAndListValidation() {
        var fields = form.querySelectorAll('.mimi_field.required');
        for (var i = 0; i < fields.length; ++i) {
            var field = fields[i],
                type = fieldType(field);
            if (type == 'checkboxes' || type == 'radio_buttons') {
                checkboxAndRadioValidation(field);
            } else {
                textAndDropdownValidation(field, type);
            }
        }
    }

    function fieldType(field) {
        var type = field.querySelectorAll('.field_type');
        if (type.length > 0) {
            return type[0].getAttribute('data-field-type');
        } else if (field.className.indexOf('checkgroup') >= 0) {
            return 'checkboxes';
        } else {
            return 'text_field';
        }
    }

    function checkboxAndRadioValidation(field) {
        var inputs = field.getElementsByTagName('input'),
            selected = false;
        for (var i = 0; i < inputs.length; ++i) {
            var input = inputs[i];
            if ((input.type == 'checkbox' || input.type == 'radio') && input.checked) selected = true;
        }
        if (selected) {
            field.className = field.className.replace(/ invalid/g, '');
        } else {
            if (field.className.indexOf('invalid') == -1) field.className += ' invalid';
            isValid = false;
        }
    }

    function textAndDropdownValidation(field, type) {
        var inputs = field.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; ++i) {
            var input = inputs[i];
            if (input.name.indexOf('signup') >= 0) {
                if (type == 'text_field') {
                    textValidation(input);
                } else {
                    dropdownValidation(field, input);
                }
            }
        }
        htmlEmbedDropdownValidation(field);
    }

    function textValidation(input) {
        if (input.id == 'signup_email') return;
        var val = input.value;
        if (val == '') {
            textFieldError(input);
            isValid = false;
            return;
        } else {
            removeTextFieldError(input)
        }
    }

    function dropdownValidation(field, input) {
        var val = input.value;
        if (val == '') {
            if (field.className.indexOf('invalid') == -1) field.className += ' invalid';
            onSelectCallback(input);
            isValid = false;
            return;
        } else {
            field.className = field.className.replace(/ invalid/g, '');
        }
    }

    function htmlEmbedDropdownValidation(field) {
        var dropdowns = field.querySelectorAll('.mimi_html_dropdown');
        for (var i = 0; i < dropdowns.length; ++i) {
            var dropdown = dropdowns[i],
                val = dropdown.value;
            if (val == '') {
                if (field.className.indexOf('invalid') == -1) field.className += ' invalid';
                isValid = false;
                dropdown.onchange = validate;
                return;
            } else {
                field.className = field.className.replace(/ invalid/g, '');
            }
        }
    }

    function textFieldError(input) {
        input.className = 'required invalid';
        input.placeholder = input.getAttribute('data-required-field');
    }

    function removeTextFieldError(input) {
        input.className = 'required';
        input.placeholder = '';
    }

    function onSelectCallback(input) {
        if (typeof Widget != 'undefined' && Widget.BasicDropdown != undefined) {
            var dropdownEl = input.parentNode,
                instances = Widget.BasicDropdown.instances;
            for (var i = 0; i < instances.length; ++i) {
                var instance = instances[i];
                if (instance.wrapperEl == dropdownEl) {
                    instance.onSelect = validate;
                }
            }
        }
    }

    function updateFormAfterValidation() {
        form.className = setFormClassName();
        submit.value = submitButtonText();
        submit.disabled = !isValid;
        submit.className = isValid ? 'submit' : 'disabled';
    }

    function setFormClassName() {
        var name = form.className;
        if (isValid) {
            return name.replace(/\s?mimi_invalid/, '');
        } else {
            if (name.indexOf('mimi_invalid') == -1) {
                return name += ' mimi_invalid';
            } else {
                return name;
            }
        }
    }

    function submitButtonText() {
        var invalidFields = document.querySelectorAll('.invalid'),
            text;
        if (isValid || invalidFields == undefined) {
            text = submit.getAttribute('data-default-text');
        } else {
            if (invalidFields.length > 1 || invalidFields[0].className.indexOf('checkgroup') == -1) {
                text = submit.getAttribute('data-invalid-text');
            } else {
                text = submit.getAttribute('data-choose-list');
            }
        }
        return text;
    }

    function revalidateOnChange() {
        var fields = form.querySelectorAll(".mimi_field.required");
        for (var i = 0; i < fields.length; ++i) {
            var inputs = fields[i].getElementsByTagName('input');
            for (var j = 0; j < inputs.length; ++j) {
                inputs[j].onchange = validate;
            }
        }
    }
})();