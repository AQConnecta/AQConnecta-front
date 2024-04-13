import React from "react";
import * as C from "./styles";

function Input({type, placeholder}: {type: string; placeholder: string}){
    return(
        <C.input type={type} placeholder={placeholder}/>
    );
}

export default Input;