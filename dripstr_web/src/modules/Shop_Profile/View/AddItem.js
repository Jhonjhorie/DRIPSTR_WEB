import SideBar from "../Component/Sidebars";
import React, { useEffect, useState } from "react";

const AddItem = () => {
  const [variants, setVariants] = useState([]);

  const addVariant = () => {
      setVariants([...variants, { name: '', image: null, info: [] }]);
  };

  const removeVariant = (index) => {
      const newVariants = variants.filter((_, i) => i !== index);
      setVariants(newVariants);
  };

  const handleNameChange = (index, event) => {
      const newVariants = [...variants];
      newVariants[index].name = event.target.value;
      setVariants(newVariants);
  };

  const handleImageChange = (index, event) => {
      const newVariants = [...variants];
      newVariants[index].image = URL.createObjectURL(event.target.files[0]);
      setVariants(newVariants);
  };

  const addInfo = (index) => {
      const newVariants = [...variants];
      newVariants[index].info.push({ size: '', quantity: '', price: '' });
      setVariants(newVariants);
  };

  const handleInfoChange = (variantIndex, infoIndex, field, event) => {
      const newVariants = [...variants];
      newVariants[variantIndex].info[infoIndex][field] = event.target.value;
      setVariants(newVariants);
  };

  const removeInfo = (variantIndex, infoIndex) => {
      const newVariants = [...variants];
      newVariants[variantIndex].info = newVariants[variantIndex].info.filter((_, i) => i !== infoIndex);
      setVariants(newVariants);
  };


  return (
    <div className="h-full w-full bg-slate-300 overflow-y-scroll custom-scrollbar  ">
      <div className="absolute mx-3 right-0 z-10">
        <SideBar></SideBar>
      </div>
      <div className="h-full w-full px-10 py-5">
        <div className="w-full h-auto mt-2 gap-5 flex">
          <div className=" w-3/12  gap-5 h-auto p-2">
            <div className="text-3xl font-bold text-slate-800">
              <box-icon type="solid" name="add-to-queue"></box-icon>{" "}
              <span className="ml-3">Add Item</span>
            </div>
            <div className=" w-full mt-10">
              <label className="text-slate-950  font-semibold mr-2 text-[17px]">
                Item Title:
              </label>
              <br />
              <input
                type="text"
                className=" bg-slate-50 p-2 rounded-sm  mt-2 text-slate-800 w-full shadow-md"
                placeholder="Item Name "
              ></input>{" "}
            </div>
            <div className=" w-full h-auto mt-2">
              <label className="text-slate-950  font-semibold mr-2 text-[17px]">
                Item Description:
              </label>
              <br />
              <textarea
                className=" bg-slate-50 p-2 rounded-sm h-28 mt-2 text-slate-800 w-full shadow-md resize-none"
                placeholder="Type your Item Description "
              ></textarea>
            </div>
            <div className="w-full h-56">
              <div className="w-full flex justify-between align">
                <div className="p-1 text-slate-950  font-semibold text-[17px]">
                  Type 3 tags for your Item.
                </div>
                <div
                  className="tooltip tooltip-bottom p-1 cursor-help "
                  data-tip="Type three tags here such as 'Shirt', 'Polo', 'Appliances', etc... that suits to your Item."
                >
                  <box-icon name="info-circle"></box-icon>
                </div>
              </div>
              <div className=" w-full ">
                <input
                  type="text"
                  className=" bg-slate-50 p-2 rounded-sm  mt-2 text-slate-800 w-full shadow-md"
                  placeholder="Type the 1st tag here.."
                ></input>{" "}
                <input
                  type="text"
                  className=" bg-slate-50 p-2 rounded-sm  mt-2 text-slate-800 w-full shadow-md"
                  placeholder="Type the 2nd tag here.."
                ></input>{" "}
                <input
                  type="text"
                  className=" bg-slate-50 p-2 rounded-sm  mt-2 text-slate-800 w-full shadow-md"
                  placeholder="Type the 3rd tag here.."
                ></input>{" "}
              </div>
            </div>
          </div>
          <div className="w-full h-full  p-2 ">
            <button
              onClick={addVariant}
              className="p-2 bg-green-700 rounded-md shadow-slate-700 hover:scale-95 duration-200 shadow-md text-white"
            >
              Add Variant
            </button>
            <div className="w-full h-[70vh]   overflow-y-scroll mt-2 p-3">
              {variants.length === 0 && (
                <div className="text-slate-800 text-sm mt-2 text-center">
                  Please Add a Variant
                </div>
              )}
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="h-auto w-full bg-gradient-to-br from-violet-500 to-fuchsia-500 glass p-2 rounded-md shadow-slate-500 shadow-md mb-2"
                >
                  <div className="w-full h-auto flex  gap-2 justify-center">
                    <div className="w-full bg-slate-300 h-[300px] bg-opacity-50 rounded-md overflow-hidden glass overflow-y-scroll p-5">
                      <div className="w-full  flex  justify-between items-center mb-2 justify-items-center place-content-center">
                        <input
                          type="text"
                          placeholder="Variant Name"
                          className="bg-slate-100 p-2 font-bold text-slate-800 justify-items-centertext-black shadow-md w-full max-w-xs rounded-md"
                          value={variant.name}
                          onChange={(e) => handleNameChange(index, e)}
                        />
                        <button
                          onClick={() => addInfo(index)}
                          data-tip="Add Sizing, Price, and Quantity."
                          className="bg-green-800 hover:bg-green-500 duration-200 glass rounded-md p-2 hover:scale-95 text-white tooltip tooltip-bottom flex items-center gap-2"
                        >
                          Add Info<i className="fas fa-plus"></i>
                        </button>
                        <button
                          onClick={() => removeVariant(index)}
                          data-tip="Remove this Variant."
                          className="bg-red-800 hover:bg-red-500 duration-200 glass rounded-md p-2 hover:scale-95 text-white flex tooltip tooltip-bottom items-center gap-2"
                        >
                          Delete<i className="fas fa-trash-alt"></i>
                        </button>
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        className="bg-custom-purple text-white p-1.5 w-full mb-5  shadow-md rounded-md"
                        onChange={(e) => handleImageChange(index, e)}
                        
                      />
                     

                      {variant.info.map((info, infoIndex) => (
                        <div
                          key={infoIndex}
                          className="w-full flex items-center mt-2"
                        >
                          <div className="w-full flex justify-between">
                            <div className="gap-2 flex place-items-center">
                              <label className="text-black  font-semibold text-sm">
                                Size:
                              </label>
                              <input
                                type="text"
                                className="w-20 p-1 text-black font-semibold bg-slate-100 rounded-md"
                                value={info.size}
                                onChange={(e) =>
                                  handleInfoChange(index, infoIndex, "size", e)
                                }
                              />
                            </div>
                            <div className="gap-2 flex place-items-center">
                              <label className="text-black  font-semibold text-sm">
                                Quantity:
                              </label>
                              <input
                                type="number"
                                className="w-20 p-1 text-black  font-semibold bg-slate-100 rounded-md"
                                value={info.quantity}
                                onChange={(e) =>
                                  handleInfoChange(
                                    index,
                                    infoIndex,
                                    "quantity",
                                    e
                                  )
                                }
                              />
                            </div>
                            <div className="gap-2 flex place-items-center">
                              <label className="text-black font-semibold text-sm">
                                Price:
                              </label>
                              <input
                                 type="number"
                                className="w-20 p-1 text-black  font-semibold bg-slate-100 rounded-md"
                                value={info.price}
                                onChange={(e) =>
                                  handleInfoChange(index, infoIndex, "price", e)
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <button
                              onClick={() => removeInfo(index, infoIndex)}
                              className="bg-red-800 ml-5 hover:bg-red-500 duration-200 glass rounded-md p-2 hover:scale-95 text-white flex tooltip tooltip-bottom items-center gap-2"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="w-auto bg-slate-50 rounded-md p-2 justify-center">
                      <div className="h-[220px] w-[250px] bg-slate-200 rounded-sm">
                          {/*Selected Image will show here*/}

                          {variant.image && (
                          <img src={variant.image} alt={`Selected image for variant ${index}`} className="h-full w-full object-cover rounded-sm" />
                                 )}        

                      </div>
                    </div>
                  </div>
                </div>
              ))}
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
