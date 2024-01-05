import React, { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller } from 'react-hook-form';

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
// DropzoneComponent with custom onChange handler
const DropzoneComponent = ({ onChange, name, ...rest }) => {
    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject
    } = useDropzone({
        onDrop: (acceptedFiles) => {
            // Custom event object for react-hook-form
            const event = {
                target: {
                    name, // Name of the input
                    value: acceptedFiles // Files accepted
                }
            };
            onChange(event); // Call onChange from react-hook-form
        },
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
        <div className="container w-full">
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <div>
                    {acceptedFiles.length > 0 ? 
                        <>
                            <p className='font-semibold text-black'>Uploaded Files:</p>
                            <ul className='text-black'>{acceptedFileItems}</ul>
                        </>
                        :
                        <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
                    }
                </div>
            </div>
        </div>
    );
};

// StyledDropzone component
function StyledDropzone({ control, name, ...rest }) {
    return (
        <Controller
            control={control}
            name={name}
            defaultValue={[]}
            render={({ field: { onChange } }) => (
                <DropzoneComponent onChange={onChange} name={name} {...rest} />
            )}
        />
    );
}

export default StyledDropzone;


// import { useFormContext, Controller } from 'react-hook-form'
// import {useDropzone} from 'react-dropzone'


// // ... [imports remain the same]

// function DropzoneComponent({ control, name, ...rest}) {
//     // Handle the drop event
//     const onDrop = (acceptedFiles) => {
//         // Log the file details here if needed
//         console.log("Files dropped:", acceptedFiles);
//         control.setValue(name, acceptedFiles);
//     };

//     return (
//         <Controller
//             control={control}
//             name={name}
//             defaultValue={[]}
//             render={({ field: { onChange, onBlur, value } }) => (
//                 <div {...useDropzone({ onDrop }).getRootProps()}>
//                     <input {...useDropzone({ onDrop }).getInputProps()} />
//                     <p>Drag 'n' drop some files here, or click to select files</p>
//                 </div>
//             )}
//         />
//     );
// }

// export default DropzoneComponent;

// // export const DropzoneField = ({
// //     name,
// //     multiple,
// //     ...rest
// //   }) => {
// //     const { control } = useFormContext()
  
// //     return (
// //       <Controller
// //         render={({ onChange }) => (
// //           <Dropzone
// //             multiple={multiple}
// //             onChange={e =>
// //               onChange(multiple ? e.target.files : e.target.files[0])
// //             }
// //             {...rest}
// //           />
// //         )}
// //         name={name}
// //         control={control}
// //         defaultValue=''
// //       />
// //     )
// //   }
// // const baseStyle = {
// //     flex: 1,
// //     display: 'flex',
// //     flexDirection: 'column',
// //     alignItems: 'center',
// //     padding: '20px',
// //     borderWidth: 2,
// //     borderRadius: 2,
// //     borderColor: '#eeeeee',
// //     borderStyle: 'dashed',
// //     backgroundColor: '#fafafa',
// //     color: '#bdbdbd',
// //     outline: 'none',
// //     transition: 'border .24s ease-in-out'
// //   };
  
// //   const focusedStyle = {
// //     borderColor: '#2196f3'
// //   };
  
// //   const acceptStyle = {
// //     borderColor: '#00e676'
// //   };
  
// //   const rejectStyle = {
// //     borderColor: '#ff1744'
// //   };
  
// //   function Dropzone({
// //     multiple,
// //     onChange,
// //     ...rest
// //   }) {
// //     const {
// //       acceptedFiles,
// //       getRootProps,
// //       getInputProps,
// //       isFocused,
// //       isDragAccept,
// //       isDragReject
// //     } = useDropzone({
// //       maxFiles: 1,
// //       multiple,
// //       ...rest
// //     });
  
// //     const acceptedFileItems = acceptedFiles.map(file => (
// //       <li key={file.path}>
// //         {file.path} - {file.size} bytes
// //       </li>
// //     ));
// //       console.log(acceptedFileItems)
// //     const style = useMemo(() => ({
// //       ...baseStyle,
// //       ...(isFocused ? focusedStyle : {}),
// //       ...(isDragAccept ? acceptStyle : {}),
// //       ...(isDragReject ? rejectStyle : {})
// //     }), [
// //       isFocused,
// //       isDragAccept,
// //       isDragReject
// //     ]);
  
// //     return (
// //       <div className="container w-full">
// //         <div {...getRootProps({style})}>
// //           <input {...getInputProps()} />
// //           <div>
// //               {acceptedFiles.length > 0 ? 
// //                   <>
// //                       <p className='font-semibold text-black'>Uploaded Files:</p>
// //                       <ul className='text-black'>{acceptedFileItems}</ul>
// //                   </>
// //                   :
// //                   <p>"Drag 'n' drop some files here, or click to select files"</p>
// //               }
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }
  
// //   export default StyledDropzone;