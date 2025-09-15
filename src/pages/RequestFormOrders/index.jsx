import React from 'react'
import RequestFormOrders from '../../components/RequestFormOrders'
import "./requestform.css"
const RequestOrders = () => {
  return (
    <main>
        <div className="container custom-request-order-container mt-5">
           <RequestFormOrders />
           
        </div>
    </main>
  )
}

export default RequestOrders