import KeyboardNavigatable from 'flarum/forum/utils/KeyboardNavigatable';

declare module 'flarum/forum/components/TextEditor' {
    export default interface TextEditor {
        loremIpsumNavigator: KeyboardNavigatable
    }
}
