import axios from 'axios';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';

function App() {
  const [students, setStudents] = useState();

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
        getStudents(); //con el setStudets sustituimos y borraba todo, hay q recargar
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
              <th scope="col">Options</th>
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
        onSubmit={(values) => handleAddStudent(values)}
      >
        {() => (
          <Form>
            <div className="card m-5">
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Nombre:</label>
                  <Field
                    name="name"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellidos:</label>
                  <Field
                    name="surname"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Edad:</label>
                  <Field
                    name="age"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nota media:</label>
                  <Field
                    name="score"
                    className="form-control"
                  />
                </div>
                <button type="submit">Añadir</button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default App;
