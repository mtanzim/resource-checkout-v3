import { addResourceGroup } from "@/actions/resourceGroup";

export default function AddNew() {
  return (
    <form action={addResourceGroup}>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text text-base">Add a new resource group</span>
        </label>
        <div className="flex gap-4">
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs p-2"
          />
          <input
            type="submit"
            className="btn btn-primary"
            value="Submit"
          ></input>
        </div>
      </div>
    </form>
  );
}
