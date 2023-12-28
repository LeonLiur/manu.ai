import React, { forwardRef, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller } from 'react-hook-form';

// Define your styles here...

// Separate component for dropzone logic
const DropzoneComponent = forwardRef(({ onChange, ...rest }, ref) => {
    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject
    } = useDropzone({
        onDrop: onChange,
        multiple: false,
        ...rest
    });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [isFocused, isDragAccept, isDragReject]);

    const acceptedFileItems = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <div className="container w-full cursor-pointer" ref={ref}>
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <div>
                    {acceptedFiles.length > 0 ?
                        <>
                            <p className='font-semibold text-black'>Uploaded Files:</p>
                            <ul className='text-black'>{acceptedFileItems}</ul>
                        </>
                        :
                        <p>Drop file here or <span className='underline'>upload</span></p>
                    }
                </div>
            </div>
        </div>
    );
});

DropzoneComponent.displayName = 'DropzoneComponent';

// Your StyledDropzone component
const StyledDropzone = forwardRef(({ control, name, ...rest }, ref) => {
    return (
        <Controller
            control={control}
            name={name}
            defaultValue={[]}
            render={({ field: { onChange } }) => (
                <DropzoneComponent onChange={onChange} {...rest} ref={ref} />
            )}
        />
    );
})

StyledDropzone.displayName = 'StyledDropzone';

export default StyledDropzone;

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};
