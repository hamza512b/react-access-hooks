<div align="center">
    <img src="./docs/react-access.png" width="124">
    <h1>Linears React Access</h1>
</div>

React hooks library for simplifying the implementation of accessible React components.


## The why
Accessibility is very important, yet it is one of many aspects the developer needs to worry about when developing a website.

This package tries to simplify the way to implement accessible UI. It helps doing that by organizing and abstracting the logic and thus making your code more readable, but still giving you control.

# Installation
```
# npm
npm i @linears/react-access

# yarn 
yarn add @linears/react-access
```

# Usage
Currently the package include these hooks:
- `useKeyboardAction` executes a callback when key is pressed.
- `useOutsideClick` executes a callback when clicking outside an element.


## useKeyboardAction
| Name         | Default | Description                                                                                                                                                                                                                                                                                                   |
| ------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key          | N/A     | [Key Code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) e.g. Enter, Space, ArrowUp. When the key is pressed the `action` function will be executed.  If key is set to `printable`, printable keys (characters) will be passed to the `action` callback as second argument. |
| action       | N/A     | A callback to be executed when `key` is pressed. The first argument is the Keyboard event object. If the `key` is set to `printable`, the second argument is set to the passed characters.                                                                                                                   |
| condition    | true    | The callback can be executed only if the condition is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy).                                                                                                                                                                                                                                                    |
| target       | window  | The element (target), the event listener will be added to.                                                                                                                                                                                                                                                     |
| clearTimeout | 750     | Milliseconds for the printable keys (characters) to be cleared                                                                                                                                                                                                                                               |

### Basic example
```jsx
function App () {
    // ...
    
    useKeyboardAction({
        key: "ArrowDown",
        condition: open,
        action: (ev) => selectNextItem(),
        target: ListRef.current,
    });

    // Return some JSX
}
```

When `ArrowDown` key is pressed while `target` element is in focus and `condition` is met, the `action` callback will be executed.

### Multiple keys
```jsx
function App () {
    // ...
    
    useKeyboardAction({
        key: ["keyA", "keyB"],
        action: (ev) => callback(),
    });

    // Return some JSX
}
```
Whenever `keyA`  or `keyB` are pressed, the `action` callback will be executed.


### Printable keys
```jsx
const items = ["Foo", "Bar", "Baz", "Qux", "Quux"]

function App () {
    // ...
    
    useKeyboardAction({
        key: "printable",
        clearTimeout: 500,
        action: (_, keysSoFar) => {
            const index = items.findIndex((item) => keysSoFar.toLowerCase() === item.toLowerCase());
            if (index !== -1) setActiveItem(index);
        },
    });

    // Return some JSX
}
```
Whenever printable keys (character) are pressed in interval within 500 milliseconds, the `action` callback will be called with string of the pressed keys in the second argument. 

## useOutsideClick
The `useOutsideClick` hook is far more simple it takes two arguments, HTML element reference and a callback. Whenever a click is initiated outside the element the callback will be called.


```jsx
function App () {
    // ...
    const ListboxRef = useRef(null);

    useOutsideClick(ListboxRef, () => setOpen(false));

    // Return some JSX
}
```



--------
Made by [HamzaKhuswan](https://hamzakhuswan.com) \
Licensed under MIT license