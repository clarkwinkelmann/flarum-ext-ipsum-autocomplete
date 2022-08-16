import app from 'flarum/forum/app';
import {extend} from 'flarum/common/extend';
import TextEditor from 'flarum/common/components/TextEditor';
import KeyboardNavigatable from 'flarum/forum/utils/KeyboardNavigatable';
import AutocompleteDropdown from './fragments/AutocompleteDropdown';

// Code based on Flarum's Mentions addComposerAutocomplete
app.initializers.add('clarkwinkelmann-ipsum-autocomplete', () => {
    const $container = $('<div class="ComposerBody-loremIpsumDropdownContainer"></div>');
    const dropdown = new AutocompleteDropdown();

    extend(TextEditor.prototype, 'oncreate', function () {
        const $editor = this.$('.TextEditor-editor').wrap('<div class="ComposerBody-loremIpsumWrapper"></div>');

        this.loremIpsumNavigator = new KeyboardNavigatable();
        this.loremIpsumNavigator
            .when(() => dropdown.active)
            .onUp(dropdown.up.bind(dropdown))
            .onDown(dropdown.down.bind(dropdown))
            .onSelect(dropdown.apply.bind(dropdown))
            .onCancel(dropdown.hide.bind(dropdown))
            .bindTo($editor);

        $editor.after($container);
    });

    extend(TextEditor.prototype, 'buildEditorParams', function (params) {
        params.inputListeners.push((() => {
            const selection = this.attrs.composer.editor.getSelectionRange();

            const cursor = selection[0];

            // If there's an active selection, do nothing
            if (selection[1] - cursor > 0) return;

            const lastChunk = this.attrs.composer.editor.getLastNChars(16);

            let matchIndex = lastChunk.search(/lorem(\s*ipsum)?(\s*[0-9]+)?$/i);

            if (matchIndex === -1) {
                matchIndex = lastChunk.search(/ipsum(\s*[0-9]+)?$/);
            }

            dropdown.hide();

            if (matchIndex !== -1) {
                const numberMatch = /[m\s]([1-9][0-9]*)$/.exec(lastChunk);
                if (numberMatch) {
                    dropdown.paragraphs = parseInt(numberMatch[1]);
                }

                dropdown.ipsumInsertStart = cursor - lastChunk.length + matchIndex;

                m.render($container[0], dropdown.render());

                dropdown.show();
                const coordinates = this.attrs.composer.editor.getCaretCoordinates(dropdown.ipsumInsertStart);
                const width = dropdown.$().outerWidth();
                const height = dropdown.$().outerHeight();
                const parent = dropdown.$().offsetParent();
                let left = coordinates.left;
                let top = coordinates.top + 15;

                // Keep the dropdown inside the editor.
                if (top + height > parent.height()) {
                    top = coordinates.top - height - 15;
                }
                if (left + width > parent.width()) {
                    left = parent.width() - width;
                }

                // Prevent the dropdown from going off screen on mobile
                top = Math.max(-(parent.offset().top - $(document).scrollTop()), top);
                left = Math.max(-parent.offset().left, left);

                dropdown.show(left, top);
            }
        }) as never);
    });
});
