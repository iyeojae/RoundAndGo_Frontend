import React, { forwardRef } from 'react';

const InputField = forwardRef(({ label, value, setValue, error, type = "text" }, ref) => {
    return (
        <div id='section-cont'>
            <label>{label}</label>
            {type === "textarea" ? (
                <textarea
                    ref={ref}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className={error ? 'input-error shake' : ''}
                />
            ) : (
                <input
                    ref={ref}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className={error ? 'input-error shake' : ''}
                />
            )}
        </div>
    );
});

export default InputField;
