import React from "react";
import { useEffect, useState } from "react";
import { SERVER_URL } from '../constants.js';
import Snackbar from '@mui/material/Snackbar';
import AddCar from './AddCar.js';
import EditCar from './EditCar.js';
import { DataGrid, GridToolbarContainer,
    GridToolbarExport,
     gridClasses } from '@mui/x-data-grid';


export default function Carlist() {

    const [cars, setCars] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
                        fetchCars();
                    }, []);

        const fetchCars = () => {
            fetch(SERVER_URL + 'api/cars')
            .then(response => response.json())
            .then(data => setCars(data._embedded.cars))
            .catch(err => console.error(err));
           }

        const onDelClick = (url) => {
            if (window.confirm("Are you sure to delete?")) {
            fetch(url, {method: 'DELETE'})
            .then(response => {
                if (response.ok) {

                fetchCars();
                setOpen(true);
            }
            else {alert('Something went wrsong!');}
                })
            .catch(err => console.error(err))
           }
        }

           // Add a new car
        const addCar = (car) => {
            fetch(SERVER_URL + 'api/cars',
                {
                method: 'POST',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify(car)
                })
                .then(response => {
                    if (response.ok) {
                        fetchCars();
                    } else {
                        alert('Something went wrong!');
                    }
                })
                .catch(err => console.error(err))
            }
            // Update car
            const updateCar = (car, link) => {
            fetch(link,
                    {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(car)
                    })
                .then(response => {
                    if (response.ok) {
                fetchCars();}
                    else {
                    alert('Something went wrong!');
                    }
                })
                .catch(err => console.error(err))
        }

        const columns = [
            {field: 'brand', headerName: 'Brand', width: 200},
            {field: 'model', headerName: 'Model', width: 200},
            {field: 'color', headerName: 'Color', width: 200},
            {field: 'year', headerName: 'Year', width: 150},
            {field: 'price', headerName: 'Price', width: 150},
            {
                field: '_links.car.href',
                headerName: '',
                sortable: false,
                filterable: false,
                renderCell: row =>
                <EditCar
                data={row}
                updateCar={updateCar} />
                },               
            {
                field: '_links.self.href',
                headerName: '',
                sortable: false,
                filterable: false,
                renderCell: row =>
                <button className='glow-on-hover'
                onClick={() => onDelClick(row.id)}>Delete
                </button>
                }
           ];

        function CustomToolbar() {
            return (
            <GridToolbarContainer
            className={gridClasses.toolbarContainer}>
            <GridToolbarExport />
            </GridToolbarContainer>
            );
           }


    return(
        <React.Fragment>            
                <div style={{ height: 500, width: '100%' }}>
                <DataGrid
                rows={cars}
                columns={columns}
                getRowId={row => row._links.self.href}
                components={{ Toolbar: CustomToolbar }}
                />                
                </div>
                <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={() => setOpen(false)}
                message="Car deleted"
                />
            <AddCar addCar={addCar} />
        </React.Fragment>
    );
}
