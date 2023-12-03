
export default function Lend() {
  return (
    <div className=" min-h-screen  pt-48 flex items-start justify-center">
      <div className=" grid grid-cols-12 gap-y-6 gap-x-12">
        <div className="col-span-12 border b items-center justify-center flex">
          <select className=" laptop:min-w-[400px] text-center py-5 px-8 cursor-pointer border border-gray-400 rounded-md bg-transparent text-white">
            <option>Select any token to lend</option>
            <option>ETH</option>
            <option>MATIC</option>
            <option>DAI</option>
          </select>
        </div>
        <div className=" mt-2 col-span-6 flex flex-col items-center justify-center gap-8 ">
          <div className=" py-6 px-10 laptop:min-w-[420px] flex flex-col items-stretch justify-center gap-3 text-white border border-gray-400 rounded-md ">
            <div className=" flex items-center justify-between">
              <div>Wallet Balance</div>
              <div>0.0</div>
            </div>
            <div className=" flex items-center justify-between">
              <div>Available to supply</div>
              <div>0.0</div>
            </div>
            <div className=" flex items-center justify-between">
              <div>Available to borrow</div>
              <div>0.0</div>
            </div>
          </div>
          <div className=" flex items-center justify-center gap-x-6">
            <button className=" border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white mx-auto ">
              Supply
            </button>
            <button className=" border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white mx-auto ">
              Borrow
            </button>
          </div>
        </div>
        <div className=" col-span-6 flex flex-col items-center justify-center gap-8 ">
          <div className=" py-6 px-10 laptop:min-w-[420px] flex flex-col items-stretch justify-center gap-3 text-white border border-gray-400 rounded-md ">
            <div className=" flex items-center justify-between">
              <div>Supplied amount</div>
              <div>0.0</div>
            </div>
            <div className=" flex items-center justify-between">
              <div>Borrowed amount</div>
              <div>0.0</div>
            </div>
            <div className=" flex items-center justify-between">
              <div>Interest</div>
              <div>0.0</div>
            </div>
          </div>
          <div className=" flex items-center justify-center gap-x-6">
            <button className=" border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white mx-auto ">
              Withdraw
            </button>
            <button className=" border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white mx-auto ">
              Re-pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
