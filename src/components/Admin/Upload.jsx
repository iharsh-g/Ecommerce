import { useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"

export default function Upload({ name, label, register, setValue, errors, editData = null }) {
    const [selectedFile, setSelectedFile] = useState([]);
    const [previewSource, setPreviewSource] = useState(editData ? editData : []);
    const inputRef = useRef(null);

    const onDrop = (acceptedFiles) => {
        const files = acceptedFiles;
        if (files) {
            previewFile(files);
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { "image/*": [".jpeg", ".jpg", ".png"] },
        onDrop,
    })

    const previewFile = (files) => {

        setSelectedFile([]);
        setPreviewSource([]);

        files.forEach((file) => {
            const reader = new FileReader();
            
            reader.onload = () => {
                if(reader.readyState === 2) {
                    setPreviewSource((prev) => [...prev, reader.result]);
                    setSelectedFile((prev) => [...prev, reader.result]);
                }
            }

            reader.readAsDataURL(file)
        });
    }

    useEffect(() => {
        register(name, { required: true })
    }, [register])

    useEffect(() => {
        setValue(name, selectedFile)
    }, [selectedFile, setValue])

    useEffect(() => {
        if (editData && editData.length > 0) {
            const urls = editData.map((image) => image.url);
            setPreviewSource(urls);
            setSelectedFile(urls);
        }
    }, [editData])

    return (
        <div className="flex flex-col space-y-2 mt-5">
            <label className="text-sm text-neutral-50" htmlFor={name}>
                {label} {<sup className="text-pink-500">*</sup>}
            </label>

            <div className={`${isDragActive ? "bg-neutral-600" : "bg-neutral-700"} flex min-h-[150px] sm:w-[350px] cursor-pointer items-center justify-center rounded-md`}>
                {
                    previewSource && previewSource.length > 0 ? 
                    <div className="flex w-full flex-col p-6">
                        <div className="flex flex-row gap-3 overflow-auto sm:w-[300px] w-[200px]">
                            {
                                previewSource.map((src, index) => (
                                    <img src={src} key={index} alt="Preview" className="h-full w-full rounded-md object-cover"/>
                                ))
                            }
                        </div>

                        <button type="button" onClick={() => {
                            setPreviewSource([])
                            setSelectedFile([])
                            setValue(name, [])
                        }} className="mt-3 text-neutral-400 underline">
                            Cancel
                        </button>
                    </div>
                     : (
                        <div className="flex w-full flex-col items-center p-6" {...getRootProps()}>
                            <input {...getInputProps()} ref={inputRef} />

                            <div className="grid aspect-square w-14 place-items-center rounded-full bg-black">
                                <FiUploadCloud className="text-2xl text-yellow-400" />
                            </div>

                            <p className="mt-2 max-w-[200px] text-center text-sm text-neutral-200">
                                Drag and drop an images, or click to{" "}
                                <span className="font-semibold text-yellow-50">Browse</span> a
                                file
                            </p>
                        </div>
                    )
                }
            </div>

            {
                errors[name] && (
                    <span className="ml-2 text-xs tracking-wide text-red-500">
                        {label} is required
                    </span>
                )
            }
        </div>
    )
}