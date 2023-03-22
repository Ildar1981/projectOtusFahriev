// опции настройки таблицы Данные направления
const dataTableSettings = {
  date_ref: `#LisPopoverChkLisRefDetailsTableData_referral_date`,
  patient: `#LisPopoverChkLisRefDetailsTableData_patient`,
  sex: `#LisPopoverChkLisRefDetailsTableData_sex`,
  birthdate: `#LisPopoverChkLisRefDetailsTableData_birthdate`,
  age: `#LisPopoverChkLisRefDetailsTableData_age`,
  doctor: `#LisPopoverChkLisRefDetailsTableData_referral_doctor`,
  department: `#LisPopoverChkLisRefDetailsTableData_department`,
  research: `#LisPopoverChkLisRefDetailsTableData_research`,
  sample: `#LisPopoverChkLisRefDetailsTableData_barcode_sample`,
  urgency: `#LisPopoverChkLisRefDetailsTableData_urgency`,
  barcode: `#LisPopoverChkLisRefDetailsTableData_barcode`,
  status: `#LisPopoverChkLisRefDetailsTableData_status`,
}

// опции настройки таблицы Направление (список тестов)
const refTableSettings = {
  test: `#LisPopoverChkLisRefDetailsTableRef_name`,
  result: `#LisPopoverChkLisRefDetailsTableRef_result`,
  comment: `#LisPopoverChkLisRefDetailsTableRef_comment`,
  norma: `#LisPopoverChkLisRefDetailsTableRef_norma`,
  unit: `#LisPopoverChkLisRefDetailsTableRef_unit`,
  interpretation: `#LisPopoverChkLisRefDetailsTableRef_interpretation`,
  status: `#LisPopoverChkLisRefDetailsTableRef_test_status`,
  source: `#LisPopoverChkLisRefDetailsTableRef_source`,
}

// опции настройки таблицы Список направлений
const refsTableSettings = {
  rlis_num: `#LisPopoverChkLisReferralsTable_identifier`,
  barcode: `#LisPopoverChkLisReferralsTable_barcode`,
  date_ref: `#LisPopoverChkLisReferralsTable_referral_date`,
  date_create: `#LisPopoverChkLisReferralsTable_created_at`,
  date_res: `#LisPopoverChkLisReferralsTable_analys_date`,
  patient: `#LisPopoverChkLisReferralsTable_patient`,
  birthdate: `#LisPopoverChkLisReferralsTable_patient_birthdate`,
  contingent: `#LisPopoverChkLisReferralsTable_`,
  analysis: `#LisPopoverChkLisReferralsTable_name`,
  sample: `#LisPopoverChkLisReferralsTable_barcode_sample`,
  urgency: `#LisPopoverChkLisReferralsTable_urgency`,
  status: `#LisPopoverChkLisReferralsTable_status`,
  dynamic: `#LisPopoverChkLisReferralsTable_dynamic`,
  comment: `#LisPopoverChkLisReferralsTable_comment`,
  doctor: `#LisPopoverChkLisReferralsTable_referral_doctor`,
  department: `#LisPopoverChkLisReferralsTable_department`,
  subdivision: `#LisPopoverChkLisReferralsTable_department_subdivision`,
  signed: `#LisPopoverChkLisReferralsTable_signed`,
  approved: `#LisPopoverChkLisReferralsTable_approved`,
  protocol_upl: `#LisPopoverChkLisReferralsTable_protocol_upload`,
  error: `#LisPopoverChkLisReferralsTable_error`,
}

export const tables = {
  refDataTable: {
    id: `#LisRefDetailsTableData`,
    cols: dataTableSettings,
  },
  refTable: {
    id: `#LisRefDetailsTableRef`,
    cols: refTableSettings,
  },
  refsTable: {
    id: `#LisReferralsTable`,
    cols: refsTableSettings,
  },
}