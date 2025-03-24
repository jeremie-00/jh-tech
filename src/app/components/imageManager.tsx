import Image from "next/image";

const imgDefault = {
  url: "/default.svg",
  alt: "Text alt image par default",
};

interface ImageProps {
  name?: string;
  url: string | null;
  imgSize?: string;
  alt: string;
  isAltInput?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string | null;
  setImagePreview: (url: string | null) => void;
}

export const ImageManager = ({
  name = "image",
  url,
  imgSize = "w-[150px] h-[150px]",
  alt,
  isAltInput = true,
  handleChange,
  imagePreview,
  setImagePreview,
}: ImageProps) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <>
      <div className="w-fit h-fit flex items-center justify-items-center gap-8">
        <div className="flex flex-col">
          Actuelle
          <div className="flex h-fit w-fit border border-primary rounded-lg p-4">
            <Image
              src={url && url.length > 0 ? url : imgDefault.url}
              alt="Preview"
              width={350}
              height={350}
              className={` ${imgSize} rounded-lg object-contain`}
              priority
            />
          </div>
        </div>

        <div className="flex flex-col">
          Nouvelle
          <div className="flex h-fit w-fit border border-primary rounded-lg p-4">
            <Image
              src={
                imagePreview && imagePreview.length > 0
                  ? imagePreview
                  : imgDefault.url
              }
              alt="Preview"
              width={350}
              height={350}
              className={` ${imgSize} rounded-lg object-contain`}
              priority
            />
          </div>
        </div>
      </div>
      <div className="flex flex-auto flex-col justify-center gap-4">
        <input
          type="file"
          accept="image/*"
          name={name}
          onChange={handleImageChange}
          className="custom-input shadow-none h-auto"
        />
        {isAltInput && (
          <input
            className="custom-input shadow-none h-auto"
            type="text"
            name="alt"
            placeholder="Texte alternatif"
            value={alt}
            onChange={handleChange}
          />
        )}
      </div>
    </>
  );
};
