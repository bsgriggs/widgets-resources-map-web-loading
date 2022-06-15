import { createElement, CSSProperties } from "react";

export type spinnerProps = {
    color: string;
    size: string;
    thickness: string;
    caption?: string;
};

const Spinner = (props: spinnerProps): JSX.Element => {
    const spinner: CSSProperties = {
        width: `${props.size}`,
        height: `${props.size}`,
        margin: "0 auto"
    };

    const subSpinner: CSSProperties = {
        width: `${props.size}`,
        height: `${props.size}`,
        borderWidth: `${props.thickness}`,
        borderStyle: "solid",
        borderColor: `${props.color} transparent`
    };

    return (
        <div className="web-spinner">
            <div className="spinner" style={spinner}>
                <div className="sub-spinner" style={subSpinner} />
            </div>
            <span className="mx-text">{props.caption}</span>
        </div>
    );
};

export default Spinner;
