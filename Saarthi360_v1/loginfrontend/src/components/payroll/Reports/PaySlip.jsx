import SalaryPayment from '../PayrollProcessing/SalaryPayment';

const PaySlip = () => {
    return (
        <SalaryPayment 
            showSubtitle={false} // Hide the subtitle
            customTitle="Pay Slip" // Change the title
            topButtons={false}
            activePage='single'
            tableTitle={false}
            divActions={false}
        />
    )
}

export default PaySlip;