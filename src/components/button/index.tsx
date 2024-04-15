import React from "react";
import * as C from "./styles"

function Button({text}: {text: string;}){
    return(
        <C.Button>
            {text}
        </C.Button>
    );
}

export default Button;