import React from "react"

class Hello extends React.Component {
    render() {
        return (
            <h2>Hello, {this.props.name}</h2>
        )
    }
}

export default Hello;
