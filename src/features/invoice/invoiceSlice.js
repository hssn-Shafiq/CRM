import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { invoiceService } from "../../Services/invoiceService";

// Async thunks for invoice operations
export const getAllInvoices = createAsyncThunk(
  "invoice/getAllInvoices",
  async (_, thunkAPI) => {
    try {
      return await invoiceService.getAllInvoices();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getInvoiceById = createAsyncThunk(
  "invoice/getInvoiceById",
  async (invoiceId, thunkAPI) => {
    try {
      return await invoiceService.getInvoiceById(invoiceId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createInvoice = createAsyncThunk(
  "invoice/createInvoice",
  async (invoiceData, thunkAPI) => {
    try {
      return await invoiceService.createInvoice(invoiceData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateInvoice = createAsyncThunk(
  "invoice/updateInvoice",
  async ({ id, invoiceData }, thunkAPI) => {
    try {
      return await invoiceService.updateInvoice(id, invoiceData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  "invoice/deleteInvoice",
  async (invoiceId, thunkAPI) => {
    try {
      await invoiceService.deleteInvoice(invoiceId);
      return invoiceId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const generateInvoiceFromOrder = createAsyncThunk(
  "invoice/generateInvoiceFromOrder",
  async ({ orderId, templateId }, thunkAPI) => {
    try {
      return await invoiceService.generateInvoiceFromOrder(orderId, templateId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const sendInvoiceByEmail = createAsyncThunk(
  "invoice/sendInvoiceByEmail",
  async ({ invoiceId, emailData }, thunkAPI) => {
    try {
      return await invoiceService.sendInvoiceByEmail(invoiceId, emailData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getInvoiceStats = createAsyncThunk(
  "invoice/getInvoiceStats",
  async (_, thunkAPI) => {
    try {
      return await invoiceService.getInvoiceStats();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const markInvoiceAsPaid = createAsyncThunk(
  "invoice/markInvoiceAsPaid",
  async ({ invoiceId, paymentData }, thunkAPI) => {
    try {
      return await invoiceService.markInvoiceAsPaid(invoiceId, paymentData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  invoices: [],
  currentInvoice: null,
  stats: {
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
    totalAmount: 0
  },
  filters: {
    status: 'all',
    dateRange: null,
    customer: null,
    template: null
  },
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
    },
    setCurrentInvoice: (state, action) => {
      state.currentInvoice = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all invoices
      .addCase(getAllInvoices.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.invoices = action.payload; // Firebase service returns data directly
      })
      .addCase(getAllInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      
      // Get invoice by ID
      .addCase(getInvoiceById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getInvoiceById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.currentInvoice = action.payload; // Firebase service returns data directly
      })
      .addCase(getInvoiceById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      
      // Create invoice
      .addCase(createInvoice.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.invoices.unshift(action.payload); // Firebase service returns data directly
        state.message = "Invoice created successfully";
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      
      // Update invoice
      .addCase(updateInvoice.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        const updatedInvoice = action.payload; // Firebase service returns data directly
        const index = state.invoices.findIndex(invoice => invoice.id === updatedInvoice.id);
        if (index !== -1) {
          state.invoices[index] = updatedInvoice;
        }
        state.currentInvoice = updatedInvoice;
        state.message = "Invoice updated successfully";
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      
      // Delete invoice
      .addCase(deleteInvoice.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.invoices = state.invoices.filter(invoice => invoice.id !== action.payload);
        state.message = "Invoice deleted successfully";
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      
      // Generate invoice from order
      .addCase(generateInvoiceFromOrder.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(generateInvoiceFromOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.invoices.unshift(action.payload); // Firebase service returns data directly
        state.message = "Invoice generated successfully from order";
      })
      .addCase(generateInvoiceFromOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      
      // Send invoice by email
      .addCase(sendInvoiceByEmail.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(sendInvoiceByEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "Invoice sent successfully";
      })
      .addCase(sendInvoiceByEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      
      // Get invoice stats
      .addCase(getInvoiceStats.fulfilled, (state, action) => {
        state.stats = action.payload; // Firebase service returns data directly
      })
      
      // Mark invoice as paid
      .addCase(markInvoiceAsPaid.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        const updatedInvoice = action.payload; // Firebase service returns data directly
        const index = state.invoices.findIndex(invoice => invoice.id === updatedInvoice.invoiceId);
        if (index !== -1) {
          state.invoices[index].status = 'paid';
          state.invoices[index].paidAt = new Date();
        }
        state.message = "Invoice marked as paid";
      });
  },
});

export const { resetState, setFilters, clearCurrentInvoice, setCurrentInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;
