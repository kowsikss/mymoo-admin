import { useEffect, useState } from "react";

import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import RoleSidebar from "../components/RoleSidebar";
import Navbar from "../components/Navbar";

import apiClient from "../api/client";

function ManageRescuedAnimal() {

  const [records, setRecords] =
    useState([]);

  const navigate =
    useNavigate();

  // FETCH RECORDS

  const fetchRecords = async () => {

    try {

      const kosalaId =
        localStorage.getItem(
          "kosalaId"
        );

      const res =
        await apiClient.get(
          `/api/rescued/kosala/${kosalaId}`
        );

      setRecords(res.data);

    } catch (err) {

      console.error(
        "Error fetching rescued animals:",
        err
      );

    }

  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // ROLE CHECK

  const role =
    localStorage.getItem("role");

  if (
    role !== "doctor" &&
    role !== "kosala-admin"
  ) {

    return <Navigate to="/" />;

  }

  // DELETE

  const handleDelete = async (
    id
  ) => {

    if (
      window.confirm(
        "Delete this record?"
      )
    ) {

      try {

        await apiClient.delete(
          `/api/rescued/${id}`
        );

        fetchRecords();

      } catch (err) {

        console.error(
          "Error deleting record:",
          err
        );

      }

    }

  };

  return (

    <div className="layout">

      <RoleSidebar />

      <div className="main">

        <Navbar />

        <h2>
          RESCUED ANIMALS
        </h2>

        {/* TABLE */}

        <div className="table-wrapper">

          <table className="table">

            <thead>

              <tr>

                <th>#</th>

                <th>PHOTO</th>

                <th>TAG NO</th>

                <th>SEX</th>

                <th>BREED</th>

                <th>AGE</th>

                <th>DATE RESCUED</th>

                <th>REASON</th>

                <th>OWNER</th>

                <th>ACTION</th>

              </tr>

            </thead>

            <tbody>

              {records.length ===
              0 ? (

                <tr>

                  <td
                    colSpan="10"
                    style={{
                      textAlign:
                        "center",
                    }}
                  >
                    No rescued animal
                    records found
                  </td>

                </tr>

              ) : (

                records.map(
                  (rec, index) => (

                    <tr key={rec._id}>

                      <td>
                        {index + 1}
                      </td>

                      {/* IMAGE */}

                      <td>

                        {rec.animalPhoto ? (

                          <img
                            src={
                              rec.animalPhoto
                            }
                            alt="animal"
                            className="cow-thumb"
                            style={{

                              width: "60px",

                              height:
                                "60px",

                              objectFit:
                                "cover",

                              borderRadius:
                                "10px",

                              cursor:
                                "pointer",

                            }}
                            onClick={() =>
                              window.open(
                                rec.animalPhoto,
                                "_blank"
                              )
                            }
                          />

                        ) : (

                          <span className="no-img">
                            No Photo
                          </span>

                        )}

                      </td>

                      {/* DATA */}

                      <td>
                        {rec.tagNumber}
                      </td>

                      <td>
                        {rec.sex}
                      </td>

                      <td>
                        {rec.breed}
                      </td>

                      <td>
                        {rec.age}
                      </td>

                      <td>
                        {
                          rec.dateOfRescued
                        }
                      </td>

                      <td>
                        {rec.reasonOfAdoption ||
                          "-"}
                      </td>

                      <td>
                        {rec.ownerName}
                      </td>

                      {/* ACTION */}

                      <td>

                        <button
                          onClick={() =>
                            navigate(
                              `/rescued-animal-detail/${rec._id}`
                            )
                          }
                        >
                          👁️
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              rec._id
                            )
                          }
                        >
                          ❌
                        </button>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}

export default ManageRescuedAnimal;