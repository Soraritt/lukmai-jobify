import { useState, useEffect } from "react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { useAppContext } from "../../context/appContext";
import { FormRow, FormRowSelect, FormRowDatetime } from "..";
import Wrapper from "../../assets/wrappers/JobRequest/JobRequestSearch";

const JobRequestSearch = () => {
  const { setFilterFn, isLoading, changePage, recordsAfterPagingAndSorting } =
    useAppContext();

  const [localSearch, setLocalSearch] = useState({
    startDate: "",
    endDate: "",
    status: "all",
    search: "",
  });

  const handleDateChange = ({ date, name }) => {
    console.log(date);

    setLocalSearch({
      ...localSearch,
      [name]: date,
    });
  };

  const handleSearch = (e) => {
    // console.log(e.target.name);
    const { name, value } = e.target;
    setLocalSearch({
      ...localSearch,
      [name]: value,
    });

    let statusText = "";
    let searchText = "";
    if (name === "status") {
      statusText = value;
      searchText = localSearch.search;
    } else if (name === "search") {
      statusText = localSearch.status;
      searchText = value;
    }
    statusText = statusText === "all" ? "" : statusText;
    changePage(0);

    setFilterFn({
      fn: (items) => {
        return items.filter(
          (item) =>
            item.status?.toString().includes(statusText) &&
            (item.requestBy.toLowerCase().includes(searchText) ||
              item.jobRequestNo
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
              item.jobCompanyName.toLowerCase().includes(searchText))
        );
      },
    });
  };

  const handleclear = (e, child) => {
    let statusText = "";
    let searchText = "";

    if (child === "clearbtn") {
      setLocalSearch({
        startDate: "",
        endDate: "",
        status: "all",
        search: "",
      });
      statusText = "";
      let searchText = "";
    } else if (child === "cleartext") {
      setLocalSearch({
        ...localSearch,
        search: "",
      });
      statusText = localSearch.status;
      searchText = "";
    }

    changePage(0);
    statusText = statusText === "all" ? "" : statusText;

    setFilterFn({
      fn: (items) => {
        return items.filter(
          (item) =>
            item.status?.toString().includes(statusText) &&
            (item.requestBy.toLowerCase().includes(searchText) ||
              item.jobRequestNo.toLowerCase().includes(searchText) ||
              item.jobCompanyName.toLowerCase().includes(searchText))
        );
      },
    });
  };

  useEffect(() => {
    setLocalSearch({
      startDate: "",
      endDate: "",
      status: "all",
      search: "",
    });
    setFilterFn({
      fn: (items) => {
        return items;
      },
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Wrapper>
      <form className="form">
        <h3>ค้นหา ข้อมูลการลงเวลา</h3>
        {/* <>{JSON.stringify(localSearch)}</> */}
        <div className="form-center">
          <FormRowDatetime
            labelText="วันที่"
            name="startDate"
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/yyyy"
            selected={localSearch.startDate}
            disabledKeyboardNavigation
            todayButton={"Today"}
            selectsEnd
            startDate={localSearch.startDate}
            endDate={localSearch.endDate}
            minDate={localSearch.startDate}
            withPortal
            disabled
            onChange={(date) => handleDateChange({ date, name: "startDate" })}
          />
          <FormRowDatetime
            labelText="ถึง วันที่"
            name="endDate"
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/yyyy"
            selected={localSearch.endDate}
            disabledKeyboardNavigation
            todayButton={"Today"}
            selectsEnd
            startDate={localSearch.startDate}
            endDate={localSearch.endDate}
            minDate={localSearch.startDate}
            withPortal
            disabled
            onChange={(date) => handleDateChange({ date, name: "endDate" })}
          />
          <FormRowSelect
            labelText="สถานะ"
            name="status"
            value={localSearch.status || ""}
            handleChange={handleSearch}
            list={[
              { id: "all", title: "All" },
              { id: "pending", title: "pending" },
              { id: "success", title: "success" },
            ]}
          />
          <button
            type="button"
            className="btn btn-block clear-btn"
            disabled={isLoading}
            onClick={(e) => handleclear(e, "clearbtn")}
          >
            เคลียร์
          </button>
        </div>
        <div className="form-row">
          <label className="form-label">ค้นหา</label>
          <div className="form-search-container">
            <div className="icon-container">
              {localSearch.search ? (
                <AiOutlineClose
                  size={22}
                  className="icon"
                  onClick={(e) => handleclear(e, "cleartext")}
                />
              ) : (
                <AiOutlineSearch size={22} className="icon" />
              )}
            </div>
            <input
              type="text"
              value={localSearch.search}
              name="search"
              onChange={handleSearch}
              className="form-input"
              placeholder="search anything ...."
            />
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default JobRequestSearch;
