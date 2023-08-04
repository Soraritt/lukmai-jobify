import * as FileSever from "file-saver";
import * as XLSX from "xlsx";
import moment from "moment";

export const ExportToExcel = ({ reportData, disabled }) => {
  const fileType = "xlsx";
  const exportToCSV = () => {
    const dataFinal = [];
    reportData.map((item, key) => {
      let obj = {
        number: ++key,
        jobRequestNo: item.jobRequestNo,
        jobCompanyName: item.jobCompanyName,
        jobRequestDate: moment(item.jobRequestDate).format("DD-MM-YYYY"),
        requestBy: item.requestBy,
        dueDate: moment(item.dueDate).format("DD-MM-YYYY"),
        periodDays:
          moment(moment(item.dueDate).format("YYYY-MM-DD")).diff(
            moment(item.jobRequestDate).format("YYYY-MM-DD"),
            "days"
          ) + 1,
        actuals:
          moment(
            moment(
              item.status === "success" ? item.updatedAt : moment()
            ).format("YYYY-MM-DD")
          ).diff(moment(item.jobRequestDate).format("YYYY-MM-DD"), "days") + 1,
        // late: daysLate({ item }),
        status: item.status,
        jobCloseDate:
          item.status === "success"
            ? moment(item.updatedAt).locale("th").format("DD-MM-YYYY")
            : "",
        details: item.details.length,
        acceptBy: item.acceptBy,
        approveBy: item.approveBy,
      };
      dataFinal.push(obj);
    });

    const ws = XLSX.utils.json_to_sheet(dataFinal);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSever.saveAs(data, "ReportFile" + ".xlsx");
  };

  return (
    <>
      <button
        type="button"
        className="btn"
        //disabled={isLoading}
        //variant="outlined"
        // disabled={disabled}
        // startIcon={<FileDownloadIcon />}
        onClick={exportToCSV}
      >
        Download File
      </button>
    </>
  );
};
