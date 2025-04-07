import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, Grid, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const employees = [
  { id: 'E001', name: 'Aagam Sheth' },
  { id: 'E002', name: 'Avadai Marthuvar' },
  { id: 'E003', name: 'Hrutika Mohal' },
  { id: 'E004', name: 'Jahnvi Thakker' },
  { id: 'E005', name: 'Joyeeta Khaskel' },
  { id: 'E006', name: 'Komal Bhanushali' },
  { id: 'E007', name: 'Preshita Rane' },
  { id: 'E008', name: 'Priyanka Panjwani' },
  { id: 'E009', name: 'Rajalaxmi Das' },
  { id: 'E010', name: 'Rashesh Doshi' },
  { id: 'E011', name: 'Rushali Rajgor' },
  { id: 'E012', name: 'Snehal kadu' },
  { id: 'E013', name: 'Surbhi Jain' },
  { id: 'E014', name: 'Vaishnavi Bhagat' },
  { id: 'E015', name: 'Vedika Tolani' },
  { id: 'E016', name: 'Jagruti Doshi' },
  { id: 'E017', name: 'Kajal Khamkar' },
  { id: 'E018', name: 'Nishi Doshi' },
  { id: 'E019', name: 'Deepti Singh' },
  { id: 'E020', name: 'Bankim Doshi' },
  { id: 'E021', name: 'Nita Doshi' },
  { id: 'E022', name: 'Pragya Doshi' },
  { id: 'E023', name: 'Chaitali Doshi' },
  { id: 'E024', name: 'Preeti Doshi' },
  { id: 'E025', name: 'Kinjal Patel' },
  { id: 'E026', name: 'Minal Sanghvi' },
  { id: 'E027', name: 'Jigna Sanghvi' },
  { id: 'E028', name: 'SAUMYA KIRIT GALA' },
  { id: 'E029', name: 'Shreya Santosh Talashilkar' },
];

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

const FormControlStyled = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(1),
  minWidth: 120,
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

function GeneratePaySlip() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [payPeriod, setPayPeriod] = useState({ startDate: '', endDate: '' });
  const [grossSalary, setGrossSalary] = useState('');
  const [deductions, setDeductions] = useState({ pf: '', pt: '', tds: '' });
  const [netSalary, setNetSalary] = useState('');
  const [bonus, setBonus] = useState('');
  const [additionalAllowance, setAdditionalAllowance] = useState('');

  useEffect(() => {
    const calculateNetSalary = () => {
      const gross = parseFloat(grossSalary) || 0;
      const pf = parseFloat(deductions.pf) || 0;
      const pt = parseFloat(deductions.pt) || 0;
      const tds = parseFloat(deductions.tds) || 0;
      const bonusAmount = parseFloat(bonus) || 0;
      const allowance = parseFloat(additionalAllowance) || 0;
      const net = gross - pf - pt - tds + bonusAmount + allowance;
      setNetSalary(net.toFixed(2));
    };

    calculateNetSalary();
  }, [grossSalary, deductions, bonus, additionalAllowance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in deductions) {
      setDeductions((prevDeductions) => ({
        ...prevDeductions,
        [name]: value,
      }));
    } else if (name in payPeriod) {
      setPayPeriod((prevPayPeriod) => ({
        ...prevPayPeriod,
        [name]: value,
      }));
    } else {
      switch (name) {
        case 'grossSalary':
          setGrossSalary(value);
          break;
        case 'bonus':
          setBonus(value);
          break;
        case 'additionalAllowance':
          setAdditionalAllowance(value);
          break;
        default:
          break;
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Generate payslip logic here
    console.log('Payslip Data:', {
      selectedEmployeeId,
      payPeriod,
      grossSalary,
      deductions,
      netSalary,
      bonus,
      additionalAllowance,
    });
  };

  const handleDownload = () => {
    // Download payslip logic here
    console.log('Download Payslip');
  };

  return (
    <Root>
      <PaperStyled>
        <Typography variant="h4" gutterBottom>
          Generate PaySlip
        </Typography>
        <FormControlStyled fullWidth>
          <InputLabel id="employee-select-label">Select Employee</InputLabel>
          <Select
            labelId="employee-select-label"
            id="employee-select"
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
          >
            {employees.map((emp) => (
              <MenuItem key={emp.id} value={emp.id}>
                {emp.name}
              </MenuItem>
            ))}
          </Select>
        </FormControlStyled>
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="startDate"
                name="startDate"
                label="Pay Period Start Date"
                type="date"
                value={payPeriod.startDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="endDate"
                name="endDate"
                label="Pay Period End Date"
                type="date"
                value={payPeriod.endDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="grossSalary"
                name="grossSalary"
                label="Gross Salary"
                value={grossSalary}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="pf"
                name="pf"
                label="Provident Fund"
                value={deductions.pf}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="pt"
                name="pt"
                label="Professional Tax"
                value={deductions.pt}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="tds"
                name="tds"
                label="TDS"
                value={deductions.tds}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="netSalary"
                name="netSalary"
                label="Net Salary"
                value={netSalary}
                onChange={handleChange}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="bonus"
                name="bonus"
                label="Bonus (if applicable)"
                value={bonus}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="additionalAllowance"
                name="additionalAllowance"
                label="Additional Allowance (if applicable)"
                value={additionalAllowance}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <ButtonStyled variant="contained" color="primary" type="submit">
                Generate PaySlip
              </ButtonStyled>
              <ButtonStyled variant="contained" color="secondary" onClick={handleDownload}>
                Download PaySlip
              </ButtonStyled>
            </Grid>
          </Grid>
        </form>
      </PaperStyled>
    </Root>
  );
}

export default GeneratePaySlip;