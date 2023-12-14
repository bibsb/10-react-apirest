import axios from 'axios';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';

function App() {
  const [students, setStudents] = useState();
  const [editStudent, setEditStudent] = useState(null);

  // CARGA DE TODOS LOS ALUMNOS
  const getStudents = () => {
    axios
      .get('http://localhost:3000/students')
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => console.log('ERROR', error.message));
  };

  useEffect(() => {
    getStudents();
  }, []);
  
  //ELIMINAR UN ALUMNO
  const deleteStudent = (studentID) => {
    axios
      .delete(`http://localhost:3000/students/${studentID}`)
      .then(() => {
        getStudents(); 
      })
      .catch((error) => console.log('ERROR', error.message));
  };

  //AÑADIR UN ALUMNO
  const handleAddStudent = (payload) => {
    axios
      .post('http://localhost:3000/students/', payload)
      .then(() => {
        getStudents();
      })
      .catch((error) => console.log('ERROR', error.message));
  };

  // CARGA DE uno para EDIT
  const setEditStudentById = (studentID) => {
    if (studentID) {
      axios
        .get(`http://localhost:3000/students/${studentID}`)
        .then((response) => {
          setEditStudent(response.data);
        })
        .catch((error) => console.log('ERROR', error.message));
    } else {
      //Limpio para q no salga siempre el primero q selecciono
      setEditStudent(null);
    }
  };
  //EDITAR UN ALUMNO
  const handleEditStudent = (studentID, payload) => {
    axios
      .put(`http://localhost:3000/students/${studentID}`, payload)
      .then(() => {
        getStudents();
      })
      .catch((error) => console.log('ERROR', error.message));
  };
  console.log('alumnos', students);

  return (
    <>
      <h1>Alumnos</h1>
      {students === undefined ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre</th>
              <th scope="col">Apellidos</th>
              <th scope="col">Edad</th>
              <th scope="col">Nota Media</th>
              <th scope="col">Eliminar</th>
              <th scope="col">Modificar</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <th scope="row">{student.id}</th>
                <td>{student.name}</td>
                <td>{student.surname}</td>
                <td>{student.age}</td>
                <td>{student.score}</td>
                <td>
                  <button onClick={() => deleteStudent(student.id)}>DEL</button>
                </td>
                <td>
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                    onClick={() => setEditStudentById(student.id)}
                  >
                    MOD
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Formik
        initialValues={{
          name: '',
          surname: '',
          age: '',
          score: '',
        }}
        onSubmit={(values, { resetForm }) => {
          handleAddStudent(values);
          resetForm();
        }}
      >
        {() => (
          <Form>
            <div className="card m-5">
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Nombre:</label>
                  <Field name="name" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellidos:</label>
                  <Field name="surname" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Edad:</label>
                  <Field name="age" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nota media:</label>
                  <Field name="score" className="form-control" />
                </div>
                <button type="submit">Añadir</button>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      {/* MODAL */}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Editar Alumno</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              {editStudent && (
                <Formik
                  initialValues={{
                    name: editStudent.name || '',
                    surname: editStudent.surname || '',
                    age: editStudent.age || '',
                    score: editStudent.score || '',
                  }}
                  onSubmit={(values) => {
                    handleEditStudent(editStudent.id, values);
                    // resetForm();
                  }}
                >
                  {() => (
                    <Form>
                      <div className="card-body">
                        <div className="mb-3">
                          <label className="form-label">Nombre:</label>
                          <Field name="name" className="form-control" />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Apellidos:</label>
                          <Field name="surname" className="form-control" />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Edad:</label>
                          <Field name="age" className="form-control" />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Nota media:</label>
                          <Field name="score" className="form-control" />
                        </div>
                        <button
                          type="submit"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Editar
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => {
                  setEditStudent(null);
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
