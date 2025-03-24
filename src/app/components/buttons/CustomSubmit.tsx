import { CustomBtn } from "@/app/components/buttons/customButtons";
import { useFormStatus } from "react-dom";
import { BiLoaderAlt } from "react-icons/bi";
import { FaCheck } from "react-icons/fa6";
export const CustomSubmit = () => {
  const { pending } = useFormStatus();
  return (
    <CustomBtn
      type="submit"
      theme="icon_primary"
      //iconName="validate"
      size="md"
      className="w-fit place-self-center"
      disabled={pending}
    >
      {pending ? (
        <div className="animate-spin">
          <BiLoaderAlt />
        </div>
      ) : (
        <FaCheck />
      )}
    </CustomBtn>
  );
};
