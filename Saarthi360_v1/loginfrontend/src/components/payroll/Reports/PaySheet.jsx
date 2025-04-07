import SalaryPayment from '../PayrollProcessing/SalaryPayment';

const PaySheet = () => {
    return (
        <SalaryPayment 
            showSubtitle={false} // Hide the subtitle
            customTitle="Pay Sheet" // Change the title
            topButtons={false}
            tableTitle={false}
        />
    )
}

export default PaySheet;