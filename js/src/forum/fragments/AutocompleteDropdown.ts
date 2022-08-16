import app from 'flarum/forum/app';
import Fragment from 'flarum/common/Fragment';
import Button from 'flarum/common/components/Button';

export default class AutocompleteDropdown extends Fragment {
    active = false
    ipsumInsertStart = 0
    paragraphs = 1

    view() {
        return Button.component({
            className: 'Button LoremIpsumAutocomplete',
            onclick: this.apply.bind(this),
        }, app.translator.trans('clarkwinkelmann-ipsum-autocomplete.forum.insert', {
            input: m('input', {
                type: 'number',
                min: 1,
                step: 1,
                value: this.paragraphs,
                onchange: (event: InputEvent) => {
                    this.paragraphs = parseInt((event.target as HTMLInputElement).value);
                },
                onclick: (event: Event) => {
                    // Don't submit the button when placing cursor in input
                    event.stopPropagation();
                },
            }),
        }));
    }

    show(left: number = 0, top: number = 0) {
        this.$()
            .show()
            .css({
                left: left + 'px',
                top: top + 'px',
            });
        this.active = true;
    }

    hide() {
        this.$().hide();
        this.active = false;
    }

    up() {
        this.paragraphs++;
        this.refreshInput();
    }

    down() {
        this.paragraphs = Math.max(this.paragraphs - 1, 1);
        this.refreshInput();
    }

    refreshInput() {
        this.$('input').val(this.paragraphs);
    }

    apply() {
        app.request<any>({
            url: app.forum.attribute('apiUrl') + '/lorem-ipsum-autocomplete',
            method: 'GET',
            params: {
                paragraphs: this.paragraphs,
            },
        }).then(response => {
            app.composer.editor!.replaceBeforeCursor(this.ipsumInsertStart, response.text, false);
            this.paragraphs = 1;

            this.hide();
        });
    }
}
