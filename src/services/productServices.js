import { addEmpLeave, getEmpLeavedata, addClaim, getEmpClaimdata, getExpenseItemList, getProjectList, getEmpAttendanceData, getEmpHolidayData, empCheckData, processClaim, getClaimApproverList, getfiletotext, getAppointeeList, processAppointee, getEmployeeRequestList, getEmployeeRequestCategory, processEmployeeRequest, getEventtList, getEventResponse, processEventRes, getActivities, getActivityQc, processActivity, getInventoryItemList, processItemInv, getFieldListData, getBinNumber, itemInspect } from "../services/ConstantServies";
import { authAxios, authAxiosFilePost, authAxiosPost } from "./HttpMethod";

export function getActivityList() { 
    
    return authAxios(getActivities)
  }

  export function getManagerActivityList(res) { 
    let data = {
      'call_mode': res.call_mode 
    };
    console.log('callt type==',res.call_mode)
    return authAxios(getActivities,data)
  }

  

  export function getActivitiQcData(res) {

    let data = {
      'activity_id':res.activity_id,
      'call_mode': res.call_mode 

    };
    
    // console.log('Data==',data)
    return authAxios(getActivityQc, data)
  }


  export function postActivtyInventory(activity_invt_process) {
    let data = {};
    if (activity_invt_process) {
      data['activity_data'] = activity_invt_process;
    }
    // console.log('Data to be sent:', data);s
    return authAxiosPost(processActivity, data)
  
  }

  export function getInventoryItem() { 
    return authAxios(getInventoryItemList)
  }

  export function processItemSrl(res) {
    let data = {};
    if (res) {
      data['item_data'] = res;
    }
    console.log('Data to be sent:', data);
    return authAxiosPost(processItemInv, data)
  
  }

  export function getFieldList(res) { 
    let data = {
      'field_name': res 

    };
    return authAxios(getFieldListData,data)
  }

  export function getBinId(res) { 
    let data = {
      'item_id': res 

    };
    return authAxios(getBinNumber,data)
  }


 export function getQty(itemNum, batchNum, binNumber) {
  

  let resData = {
    'call_mode': 'GET_QTY',
    'item_number': itemNum,
    'batch_number': batchNum,
    'bin_location_id': binNumber || '' // Send empty string if null/undefined
  };

  let data = {
    'item_data': resData
  };

  console.log('For get qty data to be passed', data);
  return authAxiosPost(itemInspect, data);
}

export function processInspection(inspectData) {

  let data = {
    'item_data': inspectData
  };

  console.log('Data to be sent', data);
  return authAxiosPost(itemInspect, data);
}