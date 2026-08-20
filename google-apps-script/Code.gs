const SPREADSHEET_ID = '1_1xazCEYAIFTRQo6t5INUjTlqNlkWuLWLR2llry7u8w';
const RESPONSES_SHEET_ID = 0;
const RESPONSES_SHEET_NAME = 'Responses';
const FORM_STYLE_RESPONSES_SHEET_NAME = '網站問卷回覆';
const EXAMPLE_SPREADSHEET_ID = '1Vj7LHJ_FtCkvQTElJv_abSDPPbnP5Y6pQtX2_Bvzbas';
const EXAMPLE_RESPONSES_SHEET_NAME = '表單回覆 1';
const EXAMPLE_SUBMISSION_METADATA_KEY = 'youthCampSurveySubmissionId';

const RESPONSE_HEADERS = [
  'submittedAt',
  'submissionId',
  'schemaVersion',
  'group',
  'gender',
  'name',
  'focusAreas',
  'focusAreasOther',
  'recentMood',
  'recentMoodOther',
  'physicalEnergy',
  'psychologicalEnergy',
  'bodySignals',
  'bodySignalsOther',
  'campExpectation',
];

const VERSION_2_RESPONSE_HEADERS = [
  'submittedAt',
  'submissionId',
  'schemaVersion',
  'group',
  'name',
  'focusAreas',
  'focusAreasOther',
  'recentMood',
  'recentMoodOther',
  'physicalEnergy',
  'psychologicalEnergy',
  'bodySignals',
  'bodySignalsOther',
  'campExpectation',
];

const VERSION_1_RESPONSE_HEADERS = [
  'submittedAt',
  'submissionId',
  'schemaVersion',
  'group',
  'name',
  'focusAreas',
  'recentMood',
  'physicalEnergy',
  'psychologicalEnergy',
  'bodySignals',
  'bodySignalsOther',
  'campExpectation',
];

const FORM_STYLE_RESPONSE_HEADERS = [
  '時間戳記',
  '你的組別是?',
  '1. 近半年最常佔據我腦海的是？',
  '2. 最近半年，我最常感受到的是？',
  '3. 過去2周，我的身體能量是？\n(1分=完全耗盡, 10分=精神飽滿)',
  '4. 過去2周，我的心理能量是？\n(1分=快撐不住, 10分=很穩定)',
  '5. 我觀察自己總體最明顯的身體狀態是？',
  '課程期待大聲說 -\n你期待營隊協助你解決什麼問題?',
  'submissionId',
];

const EXAMPLE_RESPONSE_HEADERS = FORM_STYLE_RESPONSE_HEADERS.slice(0, 8);

const SCHEMA_VERSION = 3;
const PROFILE_MAX_LENGTH = 80;
const OTHER_CHOICE_MAX_LENGTH = 300;
const BODY_SIGNAL_OTHER_MAX_LENGTH = 300;
const CAMP_EXPECTATION_MAX_LENGTH = 2000;
const MIN_PUBLIC_STATISTICS_RESPONSES = 5;

const GROUP_VALUES = [
  '第一組',
  '第二組',
  '第三組',
  '第四組',
  '第五組',
  '第六組',
];

const GENDER_IDS = [
  'male',
  'female',
  'nonBinaryOrOther',
  'preferNotToSay',
];

const FOCUS_AREA_IDS = [
  'work',
  'finances',
  'family',
  'relationships',
  'health',
  'futureDirection',
  'selfGrowth',
  'other',
];

const MOOD_IDS = [
  'busy',
  'anxious',
  'empty',
  'pressured',
  'drained',
  'lost',
  'stable',
  'fulfilled',
  'hopeful',
  'other',
];

const BODY_SIGNAL_IDS = [
  'shoulderTension',
  'chestTightness',
  'stomachDiscomfort',
  'headache',
  'poorSleep',
  'fatigue',
  'mentalTension',
  'relaxed',
  'noSpecialFeeling',
];

const FOCUS_AREA_LABELS = {
  work: '工作',
  finances: '經濟',
  family: '家庭',
  relationships: '感情',
  health: '健康',
  futureDirection: '未來方向',
  selfGrowth: '自我成長',
  other: '其他',
};

const MOOD_LABELS = {
  busy: '忙碌',
  anxious: '焦慮',
  empty: '空虛',
  pressured: '壓力',
  drained: '無力',
  lost: '迷惘',
  stable: '穩定',
  fulfilled: '充實',
  hopeful: '期待',
  other: '其他',
};

const BODY_SIGNAL_LABELS = {
  shoulderTension: '肩膀緊',
  chestTightness: '胸口悶',
  stomachDiscomfort: '胃不舒服',
  headache: '頭痛',
  poorSleep: '睡不好',
  fatigue: '疲憊',
  mentalTension: '思緒緊繃',
  relaxed: '輕鬆自在',
  noSpecialFeeling: '沒有特別感覺',
};

/** Returns aggregate-only statistics for the participant-facing dashboard. */
function doGet(event) {
  if (!event || !event.parameter || event.parameter.action !== 'stats') {
    return jsonResponse_({
      ok: false,
      error: 'UNKNOWN_ACTION',
      message: 'Use action=stats to request public statistics.',
    });
  }

  try {
    return jsonResponse_(getPublicSurveyStatistics_());
  } catch (error) {
    console.error(error);
    return jsonResponse_({
      ok: false,
      error: 'STATISTICS_UNAVAILABLE',
      message: 'Statistics are temporarily unavailable.',
    });
  }
}

/**
 * Run this once from the Apps Script editor attached to the response Sheet.
 * It refuses to overwrite an existing, non-matching header row.
 */
function setupResponsesSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet
    .getSheets()
    .find((candidate) => candidate.getSheetId() === RESPONSES_SHEET_ID);

  if (!sheet) {
    throw new Error(`Could not find the worksheet with gid=${RESPONSES_SHEET_ID}.`);
  }

  const currentHeaders = sheet
    .getRange(1, 1, 1, RESPONSE_HEADERS.length)
    .getDisplayValues()[0];
  const hasExistingHeaders = currentHeaders.some((value) => value.trim() !== '');
  const headersMatch = RESPONSE_HEADERS.every(
    (header, index) => currentHeaders[index] === header,
  );
  const version2HeadersMatch = VERSION_2_RESPONSE_HEADERS.every(
    (header, index) => currentHeaders[index] === header,
  );
  const version1HeadersMatch = VERSION_1_RESPONSE_HEADERS.every(
    (header, index) => currentHeaders[index] === header,
  );

  if (
    hasExistingHeaders &&
    !headersMatch &&
    !version2HeadersMatch &&
    !version1HeadersMatch
  ) {
    throw new Error(
      'Row 1 already contains different values. Clear it or verify the target worksheet before running setup again.',
    );
  }

  if (version1HeadersMatch) {
    // Preserve existing responses while adding the two new free-text columns.
    sheet.insertColumnAfter(6);
    sheet.insertColumnAfter(8);
  }

  if (version1HeadersMatch || version2HeadersMatch) {
    // Version 3 adds gender between group and name.
    sheet.insertColumnAfter(4);
  }

  sheet.setName(RESPONSES_SHEET_NAME);
  const headerRange = sheet.getRange(1, 1, 1, RESPONSE_HEADERS.length);
  headerRange.setValues([RESPONSE_HEADERS]);
  headerRange
    .setBackground('#31413c')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 36);
  sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  sheet.getRange('K:L').setNumberFormat('0');
  sheet.getRange('G:J').setWrap(true);
  sheet.getRange('M:O').setWrap(true);

  const energyValidation = SpreadsheetApp.newDataValidation()
    .requireNumberBetween(1, 10)
    .setAllowInvalid(false)
    .setHelpText('Enter an integer from 1 to 10.')
    .build();
  sheet.getRange('K2:L').setDataValidation(energyValidation);

  const widths = [
    150, 180, 110, 130, 150, 130, 220, 220, 150, 220, 130, 150, 240,
    220, 360,
  ];
  widths.forEach((width, index) => sheet.setColumnWidth(index + 1, width));

  spreadsheet.toast('Response fields are ready.', 'Survey setup', 5);
}

/**
 * Creates the human-readable response tab in the response spreadsheet.
 * The final submissionId column is hidden and used only for retry-safe deduplication.
 */
function setupFormStyleResponsesSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = getOrCreateFormStyleResponsesSheet_(spreadsheet);

  assertFormStyleHeaders_(sheet);
  spreadsheet.toast(
    `New website responses will be stored in ${FORM_STYLE_RESPONSES_SHEET_NAME}.`,
    'Survey setup',
    5,
  );
}

/**
 * Run this once before deployment to confirm that the executing account can
 * access the existing example response tab. This function does not modify it.
 */
function verifyExampleResponsesSheetAccess() {
  const spreadsheet = SpreadsheetApp.openById(EXAMPLE_SPREADSHEET_ID);
  const sheet = getExampleResponsesSheet_(spreadsheet);

  console.log(
    `Verified write destination: ${spreadsheet.getName()} / ${sheet.getName()}`,
  );
}

/**
 * Accepts a JSON survey submission and appends it to the response worksheet.
 *
 * Expected payload:
 * {
 *   submissionId: string,
 *   schemaVersion: 3,
 *   profile: { group: string, gender: string, name: string },
 *   answers: {
 *     focusAreas: { selections: string[], other: string },
 *     recentMood: { selection: string, other: string },
 *     physicalEnergy: number,
 *     psychologicalEnergy: number,
 *     bodySignals: { selections: string[], other: string },
 *     campExpectation: string
 *   }
 * }
 */
function doPost(event) {
  try {
    if (!event || !event.postData || !event.postData.contents) {
      return jsonResponse_({
        ok: false,
        error: 'EMPTY_REQUEST',
        message: 'The request body is required.',
      });
    }

    let payload;
    try {
      payload = JSON.parse(event.postData.contents);
    } catch (error) {
      return jsonResponse_({
        ok: false,
        error: 'INVALID_JSON',
        message: 'The request body must contain valid JSON.',
      });
    }

    const submission = validateSubmission_(payload);
    const lock = LockService.getScriptLock();
    lock.waitLock(30000);

    try {
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      const sheet = spreadsheet
        .getSheets()
        .find((candidate) => candidate.getSheetId() === RESPONSES_SHEET_ID);

      if (!sheet) {
        throw new Error(`Could not find the worksheet with gid=${RESPONSES_SHEET_ID}.`);
      }

      assertHeaders_(sheet);
      const formStyleSheet = getOrCreateFormStyleResponsesSheet_(spreadsheet);
      assertFormStyleHeaders_(formStyleSheet);
      const exampleSpreadsheet = SpreadsheetApp.openById(EXAMPLE_SPREADSHEET_ID);
      const exampleSheet = getExampleResponsesSheet_(exampleSpreadsheet);

      appendExampleResponseIfMissing_(exampleSheet, submission);

      if (hasSubmission_(sheet, submission.submissionId)) {
        appendFormStyleResponseIfMissing_(formStyleSheet, submission);
        return jsonResponse_({
          ok: true,
          duplicate: true,
          submissionId: submission.submissionId,
        });
      }

      appendFormStyleResponseIfMissing_(formStyleSheet, submission);
      sheet.appendRow([
        new Date(),
        safeCell_(submission.submissionId),
        submission.schemaVersion,
        safeCell_(submission.profile.group),
        safeCell_(submission.profile.gender),
        safeCell_(submission.profile.name),
        safeCell_(JSON.stringify(submission.answers.focusAreas.selections)),
        safeCell_(submission.answers.focusAreas.other),
        safeCell_(submission.answers.recentMood.selection),
        safeCell_(submission.answers.recentMood.other),
        submission.answers.physicalEnergy,
        submission.answers.psychologicalEnergy,
        safeCell_(JSON.stringify(submission.answers.bodySignals.selections)),
        safeCell_(submission.answers.bodySignals.other),
        safeCell_(submission.answers.campExpectation),
      ]);

      return jsonResponse_({
        ok: true,
        duplicate: false,
        submissionId: submission.submissionId,
      });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    console.error(error);
    return jsonResponse_({
      ok: false,
      error: 'INVALID_SUBMISSION',
      message: error instanceof Error ? error.message : 'Submission failed.',
    });
  }
}

function validateSubmission_(payload) {
  assertPlainObject_(payload, 'Submission');
  assertString_(payload.submissionId, 'submissionId', 1, 100);

  const isLegacySubmission = payload.schemaVersion === 2;
  if (!isLegacySubmission && payload.schemaVersion !== SCHEMA_VERSION) {
    throw new Error(`schemaVersion must be 2 or ${SCHEMA_VERSION}.`);
  }

  assertPlainObject_(payload.profile, 'profile');
  assertString_(payload.profile.group, 'group', 0, PROFILE_MAX_LENGTH);
  if (
    !isLegacySubmission &&
    !GROUP_VALUES.includes(payload.profile.group)
  ) {
    throw new Error('group is required and must contain a supported value.');
  }
  if (
    !isLegacySubmission &&
    !GENDER_IDS.includes(payload.profile.gender)
  ) {
    throw new Error('gender contains an unsupported value.');
  }
  assertString_(payload.profile.name, 'name', 0, PROFILE_MAX_LENGTH);

  assertPlainObject_(payload.answers, 'answers');
  const answers = payload.answers;
  assertPlainObject_(answers.focusAreas, 'focusAreas');
  const focusAreas = validateSelection_(
    answers.focusAreas.selections,
    FOCUS_AREA_IDS,
    'focusAreas.selections',
    true,
  );
  assertString_(
    answers.focusAreas.other,
    'focusAreas.other',
    0,
    OTHER_CHOICE_MAX_LENGTH,
  );
  assertOtherSelection_(
    focusAreas.includes('other'),
    answers.focusAreas.other,
    'focusAreas.other',
  );

  assertPlainObject_(answers.recentMood, 'recentMood');
  if (!MOOD_IDS.includes(answers.recentMood.selection)) {
    throw new Error('recentMood contains an unsupported value.');
  }
  assertString_(
    answers.recentMood.other,
    'recentMood.other',
    0,
    OTHER_CHOICE_MAX_LENGTH,
  );
  assertOtherSelection_(
    answers.recentMood.selection === 'other',
    answers.recentMood.other,
    'recentMood.other',
  );

  assertScale_(answers.physicalEnergy, 'physicalEnergy');
  assertScale_(answers.psychologicalEnergy, 'psychologicalEnergy');

  assertPlainObject_(answers.bodySignals, 'bodySignals');
  const bodySelections = validateSelection_(
    answers.bodySignals.selections,
    BODY_SIGNAL_IDS,
    'bodySignals.selections',
    false,
  );
  assertString_(
    answers.bodySignals.other,
    'bodySignals.other',
    0,
    BODY_SIGNAL_OTHER_MAX_LENGTH,
  );

  if (
    bodySelections.length === 0 &&
    answers.bodySignals.other.trim().length === 0
  ) {
    throw new Error('At least one body signal or other description is required.');
  }

  assertString_(
    answers.campExpectation,
    'campExpectation',
    0,
    CAMP_EXPECTATION_MAX_LENGTH,
  );

  return {
    submissionId: payload.submissionId.trim(),
    schemaVersion: payload.schemaVersion,
    profile: {
      group: payload.profile.group.trim(),
      gender: isLegacySubmission ? '' : payload.profile.gender,
      name: payload.profile.name.trim(),
    },
    answers: {
      focusAreas: {
        selections: focusAreas,
        other: focusAreas.includes('other')
          ? answers.focusAreas.other.trim()
          : '',
      },
      recentMood: {
        selection: answers.recentMood.selection,
        other:
          answers.recentMood.selection === 'other'
            ? answers.recentMood.other.trim()
            : '',
      },
      physicalEnergy: answers.physicalEnergy,
      psychologicalEnergy: answers.psychologicalEnergy,
      bodySignals: {
        selections: bodySelections,
        other: answers.bodySignals.other.trim(),
      },
      campExpectation: answers.campExpectation.trim(),
    },
  };
}

function assertOtherSelection_(isOtherSelected, value, fieldName) {
  if (isOtherSelected && value.trim().length === 0) {
    throw new Error(`${fieldName} is required when other is selected.`);
  }
}

function validateSelection_(value, allowedValues, fieldName, required) {
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array.`);
  }

  if (required && value.length === 0) {
    throw new Error(`${fieldName} requires at least one selection.`);
  }

  if (value.some((item) => !allowedValues.includes(item))) {
    throw new Error(`${fieldName} contains an unsupported value.`);
  }

  if (new Set(value).size !== value.length) {
    throw new Error(`${fieldName} cannot contain duplicate values.`);
  }

  return value.slice();
}

function assertPlainObject_(value, fieldName) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${fieldName} must be an object.`);
  }
}

function assertString_(value, fieldName, minLength, maxLength) {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string.`);
  }

  const length = value.trim().length;
  if (length < minLength || length > maxLength) {
    throw new Error(
      `${fieldName} must contain between ${minLength} and ${maxLength} characters.`,
    );
  }
}

function assertScale_(value, fieldName) {
  if (!Number.isInteger(value) || value < 1 || value > 10) {
    throw new Error(`${fieldName} must be an integer from 1 to 10.`);
  }
}

function assertHeaders_(sheet) {
  const actualHeaders = sheet
    .getRange(1, 1, 1, RESPONSE_HEADERS.length)
    .getDisplayValues()[0];
  const headersMatch = RESPONSE_HEADERS.every(
    (header, index) => actualHeaders[index] === header,
  );

  if (!headersMatch) {
    throw new Error('The response worksheet headers do not match the expected schema.');
  }
}

function getOrCreateFormStyleResponsesSheet_(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(FORM_STYLE_RESPONSES_SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(FORM_STYLE_RESPONSES_SHEET_NAME);
  }

  const headerRange = sheet.getRange(
    1,
    1,
    1,
    FORM_STYLE_RESPONSE_HEADERS.length,
  );
  const currentHeaders = headerRange.getDisplayValues()[0];
  const hasHeaders = currentHeaders.some((value) => value.trim() !== '');

  if (!hasHeaders) {
    headerRange.setValues([FORM_STYLE_RESPONSE_HEADERS]);
    headerRange
      .setBackground('#31413c')
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setHorizontalAlignment('center')
      .setWrap(true);

    sheet.setFrozenRows(1);
    sheet.setRowHeight(1, 72);
    sheet.getRange('A:A').setNumberFormat('yyyy/mm/dd hh:mm:ss');
    sheet.getRange('C:H').setWrap(true);

    const widths = [160, 120, 250, 250, 220, 220, 280, 420, 180];
    widths.forEach((width, index) => sheet.setColumnWidth(index + 1, width));
  }

  sheet.hideColumns(FORM_STYLE_RESPONSE_HEADERS.length);
  return sheet;
}

function assertFormStyleHeaders_(sheet) {
  const actualHeaders = sheet
    .getRange(1, 1, 1, FORM_STYLE_RESPONSE_HEADERS.length)
    .getDisplayValues()[0];
  const headersMatch = FORM_STYLE_RESPONSE_HEADERS.every(
    (header, index) => actualHeaders[index] === header,
  );

  if (!headersMatch) {
    throw new Error(
      `The ${FORM_STYLE_RESPONSES_SHEET_NAME} worksheet headers do not match the expected schema.`,
    );
  }
}

function getExampleResponsesSheet_(spreadsheet) {
  const sheet = spreadsheet.getSheetByName(EXAMPLE_RESPONSES_SHEET_NAME);
  if (!sheet) {
    throw new Error(
      `Could not find the ${EXAMPLE_RESPONSES_SHEET_NAME} worksheet in the example spreadsheet.`,
    );
  }

  const actualHeaders = sheet
    .getRange(1, 1, 1, EXAMPLE_RESPONSE_HEADERS.length)
    .getDisplayValues()[0];
  const headersMatch = EXAMPLE_RESPONSE_HEADERS.every(
    (header, index) =>
      normalizeHeader_(actualHeaders[index]) === normalizeHeader_(header),
  );

  if (!headersMatch) {
    throw new Error(
      `The ${EXAMPLE_RESPONSES_SHEET_NAME} worksheet headers do not match the expected schema.`,
    );
  }

  return sheet;
}

function appendExampleResponseIfMissing_(sheet, submission) {
  const alreadyStored = sheet
    .createDeveloperMetadataFinder()
    .withKey(EXAMPLE_SUBMISSION_METADATA_KEY)
    .withValue(submission.submissionId)
    .find()
    .length > 0;

  if (alreadyStored) return false;

  const row = sheet.getLastRow() + 1;
  const values = buildReadableResponseRow_(submission);
  const destination = sheet.getRange(row, 1, 1, values.length);

  destination.setValues([values]);
  destination.setWrap(true);
  destination.getCell(1, 1).setNumberFormat('yyyy/mm/dd hh:mm:ss');
  destination.addDeveloperMetadata(
    EXAMPLE_SUBMISSION_METADATA_KEY,
    submission.submissionId,
    SpreadsheetApp.DeveloperMetadataVisibility.PROJECT,
  );
  return true;
}

function appendFormStyleResponseIfMissing_(sheet, submission) {
  if (hasFormStyleSubmission_(sheet, submission.submissionId)) return false;

  sheet.appendRow([
    ...buildReadableResponseRow_(submission),
    safeCell_(submission.submissionId),
  ]);

  return true;
}

function buildReadableResponseRow_(submission) {
  return [
    new Date(),
    safeCell_(submission.profile.group),
    safeCell_(
      formatLabeledSelections_(
        submission.answers.focusAreas.selections,
        FOCUS_AREA_LABELS,
        submission.answers.focusAreas.other,
      ),
    ),
    safeCell_(
      formatLabeledSelections_(
        [submission.answers.recentMood.selection],
        MOOD_LABELS,
        submission.answers.recentMood.other,
      ),
    ),
    formatEnergyBand_(submission.answers.physicalEnergy),
    formatEnergyBand_(submission.answers.psychologicalEnergy),
    safeCell_(
      formatLabeledSelections_(
        submission.answers.bodySignals.selections,
        BODY_SIGNAL_LABELS,
        submission.answers.bodySignals.other,
      ),
    ),
    safeCell_(submission.answers.campExpectation),
  ];
}

function hasFormStyleSubmission_(sheet, submissionId) {
  if (sheet.getLastRow() < 2) return false;

  return Boolean(
    sheet
      .getRange(
        2,
        FORM_STYLE_RESPONSE_HEADERS.length,
        sheet.getLastRow() - 1,
        1,
      )
      .createTextFinder(submissionId)
      .matchEntireCell(true)
      .findNext(),
  );
}

function formatLabeledSelections_(ids, labels, other) {
  const values = ids
    .filter((id) => id && !(id === 'other' && other))
    .map((id) => labels[id] || id);

  if (other) values.push(`其他：${other}`);
  return values.join(', ');
}

function formatEnergyBand_(value) {
  if (value <= 3) return '平均1-3分';
  if (value <= 6) return '平均4-6分';
  if (value <= 8) return '平均7-8分';
  return '平均9-10分';
}

function normalizeHeader_(value) {
  return String(value).replace(/\s+/g, ' ').trim();
}

function hasSubmission_(sheet, submissionId) {
  if (sheet.getLastRow() < 2) {
    return false;
  }

  return Boolean(
    sheet
      .getRange(2, 2, sheet.getLastRow() - 1, 1)
      .createTextFinder(submissionId)
      .matchEntireCell(true)
      .findNext(),
  );
}

function safeCell_(value) {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function jsonResponse_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/** Adds the private response dashboard entry to the Google Sheet menu. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('問卷回覆')
    .addItem('開啟回覆總覽', 'showResponsesDashboard')
    .addToUi();
}

/** Opens the dashboard for users who already have access to this Sheet. */
function showResponsesDashboard() {
  const output = HtmlService.createHtmlOutputFromFile('Responses')
    .setWidth(960)
    .setHeight(680);

  SpreadsheetApp.getUi().showModelessDialog(output, '營隊問卷回覆總覽');
}

/**
 * Called only from the Sheet-hosted dashboard through google.script.run.
 * Dates and ranges are normalized to browser-safe plain objects.
 */
function getSurveyResponses() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet
    .getSheets()
    .find((candidate) => candidate.getSheetId() === RESPONSES_SHEET_ID);

  if (!sheet) {
    throw new Error(`Could not find the worksheet with gid=${RESPONSES_SHEET_ID}.`);
  }

  assertHeaders_(sheet);
  const responseCount = Math.max(0, sheet.getLastRow() - 1);
  if (responseCount === 0) {
    return { generatedAt: new Date().toISOString(), responses: [] };
  }

  const rows = sheet
    .getRange(2, 1, responseCount, RESPONSE_HEADERS.length)
    .getValues();
  const responses = rows.map((row) => ({
    submittedAt: asIsoDate_(row[0]),
    submissionId: String(row[1] || ''),
    schemaVersion: Number(row[2]) || SCHEMA_VERSION,
    group: String(row[3] || ''),
    gender: String(row[4] || ''),
    name: String(row[5] || ''),
    focusAreas: parseStoredSelections_(row[6]),
    focusAreasOther: String(row[7] || ''),
    recentMood: String(row[8] || ''),
    recentMoodOther: String(row[9] || ''),
    physicalEnergy: Number(row[10]) || 0,
    psychologicalEnergy: Number(row[11]) || 0,
    bodySignals: parseStoredSelections_(row[12]),
    bodySignalsOther: String(row[13] || ''),
    campExpectation: String(row[14] || ''),
  }));

  return {
    generatedAt: new Date().toISOString(),
    responses: responses.reverse(),
  };
}

function getPublicSurveyStatistics_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet
    .getSheets()
    .find((candidate) => candidate.getSheetId() === RESPONSES_SHEET_ID);

  if (!sheet) {
    throw new Error(`Could not find the worksheet with gid=${RESPONSES_SHEET_ID}.`);
  }

  assertHeaders_(sheet);
  const rowCount = Math.max(0, sheet.getLastRow() - 1);
  const rows = rowCount === 0
    ? []
    : sheet.getRange(2, 1, rowCount, RESPONSE_HEADERS.length).getValues();
  const responses = rows.filter((row) => String(row[1] || '').trim() !== '');
  const totalResponses = responses.length;

  if (totalResponses < MIN_PUBLIC_STATISTICS_RESPONSES) {
    return {
      ok: true,
      available: false,
      totalResponses,
      minimumResponses: MIN_PUBLIC_STATISTICS_RESPONSES,
      generatedAt: new Date().toISOString(),
    };
  }

  const focusAreas = countSelections_(
    FOCUS_AREA_IDS,
    responses.map((row) => parseStoredSelections_(row[6])),
  );
  const recentMoods = countValues_(
    MOOD_IDS,
    responses.map((row) => String(row[8] || '')),
  );
  const bodySignals = countSelections_(
    BODY_SIGNAL_IDS,
    responses.map((row) => parseStoredSelections_(row[12])),
  );

  return {
    ok: true,
    available: true,
    totalResponses,
    minimumResponses: MIN_PUBLIC_STATISTICS_RESPONSES,
    generatedAt: new Date().toISOString(),
    averagePhysicalEnergy: averageNumbers_(responses.map((row) => row[10])),
    averagePsychologicalEnergy: averageNumbers_(responses.map((row) => row[11])),
    focusAreas,
    recentMoods,
    bodySignals,
  };
}

function countSelections_(allowedIds, selections) {
  const counts = Object.fromEntries(allowedIds.map((id) => [id, 0]));
  selections.forEach((items) => {
    [...new Set(items)].forEach((id) => {
      if (Object.prototype.hasOwnProperty.call(counts, id)) counts[id] += 1;
    });
  });
  return counts;
}

function countValues_(allowedIds, values) {
  const counts = Object.fromEntries(allowedIds.map((id) => [id, 0]));
  values.forEach((id) => {
    if (Object.prototype.hasOwnProperty.call(counts, id)) counts[id] += 1;
  });
  return counts;
}

function averageNumbers_(values) {
  const valid = values
    .map(Number)
    .filter((value) => Number.isFinite(value) && value >= 1 && value <= 10);
  if (valid.length === 0) return null;
  return Math.round((valid.reduce((sum, value) => sum + value, 0) / valid.length) * 10) / 10;
}

function parseStoredSelections_(value) {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value !== 'string' || value.trim() === '') return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch (error) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

function asIsoDate_(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}
