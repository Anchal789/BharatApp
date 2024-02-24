import React from "react";

class ErrorBoundry extends React.Component{
    state = {
        error : ""
    }

    static getDerivedStateFromError(error){
        return {
            error : error
        }
    }

    componentDidCatch(_error, _info){
        // console.log("error is" , error);
    }

    render(){
        if(this.state.error){
            return(
                <div>
                    <h1>Some went wrong.</h1>
                </div>
            )
        }
        return this.props.children;
    }
}

export default ErrorBoundry