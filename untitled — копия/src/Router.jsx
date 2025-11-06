import { Routers as RT, Router } from "react-router";
import { About } from "./Pages/About"
import FP from "./FP"

export const Router = () => {
    return <RT>
        <Route path="/" element={<FP />}></Route>
        <Route path="/about" element={<About />}></Route>
    </RT>
}