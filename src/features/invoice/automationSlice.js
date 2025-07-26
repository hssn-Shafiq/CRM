import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { automationService } from "../../Services/automationService";

// Async thunks for automation operations
export const getAllAutomationRules = createAsyncThunk(
  "automation/getAllRules",
  async (_, thunkAPI) => {
    try {
      return await automationService.getAllRules();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getAutomationRuleById = createAsyncThunk(
  "automation/getRuleById",
  async (ruleId, thunkAPI) => {
    try {
      return await automationService.getRuleById(ruleId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createAutomationRule = createAsyncThunk(
  "automation/createRule",
  async (ruleData, thunkAPI) => {
    try {
      return await automationService.createRule(ruleData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateAutomationRule = createAsyncThunk(
  "automation/updateRule",
  async ({ id, ruleData }, thunkAPI) => {
    try {
      return await automationService.updateRule(id, ruleData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteAutomationRule = createAsyncThunk(
  "automation/deleteRule",
  async (ruleId, thunkAPI) => {
    try {
      await automationService.deleteRule(ruleId);
      return ruleId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const toggleAutomationRuleStatus = createAsyncThunk(
  "automation/toggleRuleStatus",
  async ({ id, isActive }, thunkAPI) => {
    try {
      return await automationService.toggleRuleStatus(id, isActive);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const testAutomationRule = createAsyncThunk(
  "automation/testRule",
  async ({ id, testData }, thunkAPI) => {
    try {
      return await automationService.testRule(id, testData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const executeAutomationRule = createAsyncThunk(
  "automation/executeRule",
  async ({ id, orderData }, thunkAPI) => {
    try {
      return await automationService.executeRule(id, orderData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getAutomationStats = createAsyncThunk(
  "automation/getStats",
  async (_, thunkAPI) => {
    try {
      return await automationService.getAutomationStats();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getRuleHistory = createAsyncThunk(
  "automation/getRuleHistory",
  async ({ id, limit }, thunkAPI) => {
    try {
      return await automationService.getRuleHistory(id, limit);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getConditionTemplates = createAsyncThunk(
  "automation/getConditionTemplates",
  async (_, thunkAPI) => {
    try {
      return await automationService.getConditionTemplates();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  rules: [],
  currentRule: null,
  ruleHistory: [],
  conditionTemplates: [],
  stats: {
    totalRules: 0,
    activeRules: 0,
    inactiveRules: 0,
    totalExecutions: 0,
    successfulExecutions: 0,
    failedExecutions: 0
  },
  testResult: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const automationSlice = createSlice({
  name: "automation",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    clearCurrentRule: (state) => {
      state.currentRule = null;
    },
    setCurrentRule: (state, action) => {
      state.currentRule = action.payload;
    },
    clearTestResult: (state) => {
      state.testResult = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all automation rules
      .addCase(getAllAutomationRules.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllAutomationRules.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.rules = action.payload.data || action.payload;
      })
      .addCase(getAllAutomationRules.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      
      // Get automation rule by ID
      .addCase(getAutomationRuleById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAutomationRuleById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.currentRule = action.payload.data || action.payload;
      })
      .addCase(getAutomationRuleById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      
      // Create automation rule
      .addCase(createAutomationRule.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createAutomationRule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.rules.unshift(action.payload.data || action.payload);
        state.message = "Automation rule created successfully";
      })
      .addCase(createAutomationRule.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      
      // Update automation rule
      .addCase(updateAutomationRule.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateAutomationRule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        const updatedRule = action.payload.data || action.payload;
        const index = state.rules.findIndex(rule => rule.id === updatedRule.id);
        if (index !== -1) {
          state.rules[index] = updatedRule;
        }
        state.currentRule = updatedRule;
        state.message = "Automation rule updated successfully";
      })
      .addCase(updateAutomationRule.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      
      // Delete automation rule
      .addCase(deleteAutomationRule.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteAutomationRule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.rules = state.rules.filter(rule => rule.id !== action.payload);
        state.message = "Automation rule deleted successfully";
      })
      .addCase(deleteAutomationRule.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      
      // Toggle automation rule status
      .addCase(toggleAutomationRuleStatus.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(toggleAutomationRuleStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        const updatedRule = action.payload.data || action.payload;
        const index = state.rules.findIndex(rule => rule.id === updatedRule.id);
        if (index !== -1) {
          state.rules[index] = updatedRule;
        }
        state.message = `Automation rule ${updatedRule.is_active ? 'activated' : 'deactivated'} successfully`;
      })
      .addCase(toggleAutomationRuleStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      
      // Test automation rule
      .addCase(testAutomationRule.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(testAutomationRule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.testResult = action.payload.data || action.payload;
        state.message = "Rule test completed";
      })
      .addCase(testAutomationRule.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
        state.testResult = null;
      })
      
      // Execute automation rule
      .addCase(executeAutomationRule.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(executeAutomationRule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "Rule executed successfully";
      })
      .addCase(executeAutomationRule.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      
      // Get automation stats
      .addCase(getAutomationStats.fulfilled, (state, action) => {
        state.stats = action.payload.data || action.payload;
      })
      
      // Get rule history
      .addCase(getRuleHistory.fulfilled, (state, action) => {
        state.ruleHistory = action.payload.data || action.payload;
      })
      
      // Get condition templates
      .addCase(getConditionTemplates.fulfilled, (state, action) => {
        state.conditionTemplates = action.payload.data || action.payload;
      });
  },
});

export const { resetState, clearCurrentRule, setCurrentRule, clearTestResult } = automationSlice.actions;
export default automationSlice.reducer;
