import React, { useEffect, useState } from "react";
import csvFile from "./Seed_Data.csv";

const App = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [dateField, setDateField] = useState("");
  const [sortBy, setSortBy] = useState("deliveryPincode");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    var txtFile = new XMLHttpRequest();
    console.log("here");
    txtFile.open("GET", csvFile, false);
    txtFile.onreadystatechange = function () {
      var lines = txtFile.responseText.split(/\r\n|\n/);

      var result = [];

      var headers = lines[0].split(",");

      for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j]
            .split(";")
            .join(",")
            .replaceAll(":", "-")
            .replaceAll(",", " ");
        }

        result.push(obj);
      }
      setFilteredData([...result]);
    };
    txtFile.send(null);
  }, []);

  useEffect(() => {
    filteredData.length > 0 &&
      setFilteredData(
        filteredData.sort((a, b) => {
          const firstComparator =
            sortBy === "orderDate"
              ? new Date(a[sortBy]).getTime()
              : Number(a[sortBy]);
          const secondComparator =
            sortBy === "orderDate"
              ? new Date(b[sortBy]).getTime()
              : Number(b[sortBy]);

          return sortOrder === "asc"
            ? firstComparator - secondComparator
            : secondComparator - firstComparator;
        })
      );
  }, [sortBy, sortOrder, filteredData]);
  const sortByPinCode = () => {};

  const sortDataBy = (columnName) => {
    setSortBy(columnName);
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    console.log({ sortBy, sortOrder });
  };

  const filterByPinCode = ({ target }) => {
    setSearchField(target.value.trim());
  };

  const filterByDate = ({ target }) => {
    setDateField(target.value.split("-").reverse().join("/"));
  };

  return (
    <div className="container">
      <div className="col">
        <div className="col-md-12 ">
          <div className="row justify-content-between">
            <div className="form-group col-3">
              <label htmlFor="simpleinput">Pin Code : </label>
              <input
                type="text"
                id="simpleinput"
                className="form-control"
                onChange={filterByPinCode}
              />
            </div>
            <div className="form-group">
              <label htmlFor="example-date">Date : </label>
              <input
                className="form-control"
                onChange={filterByDate}
                id="example-date"
                type="date"
                name="date"
              />
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <table
            id="example"
            className="table table-striped table-bordered"
            style={{ width: "100%" }}
          >
            <thead>
              <tr>
                <th>Order Id</th>
                <th>Cust Id</th>
                <th
                  className={`caret ${
                    sortOrder === "desc" && sortBy === "deliveryPincode"
                      ? "caret-down"
                      : "caret-up"
                  }`}
                  onClick={() => sortDataBy("deliveryPincode")}
                >
                  Pin Code
                </th>
                <th
                  className={`caret ${
                    sortOrder === "desc" && sortBy === "orderDate"
                      ? "caret-down"
                      : "caret-up"
                  }`}
                  onClick={() => sortDataBy("orderDate")}
                >
                  Order Date
                </th>
                <th>Item</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => {
                const pincodesMatch = item.deliveryPincode.includes(
                  searchField
                );
                const isSameDate = item.orderDate.startsWith(dateField);

                const canShowItem = pincodesMatch && isSameDate;
                return (
                  <tr
                    key={index}
                    style={{
                      display: canShowItem ? "" : "none",
                    }}
                  >
                    <td>{item.orderId}</td>
                    <td>{item.customerId}</td>
                    <td>{item.deliveryPincode}</td>
                    <td>{item.orderDate}</td>
                    <td>{item.items}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
