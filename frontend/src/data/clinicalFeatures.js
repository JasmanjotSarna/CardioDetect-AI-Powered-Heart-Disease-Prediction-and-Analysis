/**
 * Clinical Feature Definitions, Units, Reference Ranges, and Descriptions
 * Formulated for clear patient/student understanding and verified against the UCI Heart Disease Dataset.
 */

export const CLINICAL_FEATURES = {
  Age: {
    name: 'Age',
    unit: 'Years',
    shortHelp: 'Patient chronological age at the time of assessment.',
    rangeText: '28 – 77 years (Adult clinical cohort)',
    clinicalDefinition: 'Age represents the patient’s age in completed years when clinical vitals were documented.',
    whyModelUsesIt: 'Age is an established non-modifiable cardiovascular risk factor. Vascular stiffness and arterial plaque vulnerability naturally increase with advanced age.',
    categoriesOrValues: 'Numeric integer (e.g., 54). Model training cohort spans ages 28 through 77.',
    normalReference: 'Adult range. Cardiovascular vulnerability sharply increases over age 50 in males and post-menopause in females.'
  },
  Sex: {
    name: 'Biological Sex',
    unit: 'Category',
    shortHelp: 'Sex category recorded in the clinical dataset.',
    rangeText: 'Male (M) / Female (F)',
    clinicalDefinition: 'The sex category recorded at clinical enrollment. Reflects biological sex traits in the clinical record.',
    whyModelUsesIt: 'Coronary artery disease presents differently between sexes, with variations in arterial caliber, microvascular dysfunction, and protective hormonal factors.',
    categoriesOrValues: [
      { key: 'M', label: 'Male (M)', desc: 'Higher baseline incidence of obstructive macrovascular coronary disease in midlife.' },
      { key: 'F', label: 'Female (F)', desc: 'Frequent microvascular angina patterns; elevated post-menopausal onset.' }
    ],
    normalReference: 'Categorical demographic parameter.'
  },
  ChestPainType: {
    name: 'Chest Pain Type',
    unit: 'Pattern',
    shortHelp: 'Clinical presentation and symptom pattern of chest discomfort.',
    rangeText: 'ASY, NAP, ATA, TA',
    clinicalDefinition: 'Characterizes chest discomfort based on 3 classic criteria: substernal location, precipitated by physical exertion or stress, and relieved by rest or nitroglycerin.',
    whyModelUsesIt: 'Chest pain morphology is one of the strongest predictive indicators of hemodynamically significant coronary artery stenosis.',
    categoriesOrValues: [
      { key: 'ASY', label: 'Asymptomatic (ASY)', desc: 'Absence of subjective pain. Highly significant in diabetic or older patients experiencing silent cardiac ischemia.' },
      { key: 'NAP', label: 'Non-Anginal Pain (NAP)', desc: 'Discomfort failing 2 or more anginal criteria; often musculoskeletal or gastrointestinal in origin.' },
      { key: 'ATA', label: 'Atypical Angina (ATA)', desc: 'Meets 2 of the 3 classic criteria (e.g., discomfort brought on by exertion but inconsistent relief).' },
      { key: 'TA', label: 'Typical Angina (TA)', desc: 'Substernal pressure precipitated by exertion and relieved within 5 minutes of rest or nitrates.' }
    ],
    normalReference: 'Absence of symptoms or non-cardiac discomfort.'
  },
  RestingBP: {
    name: 'Resting Blood Pressure',
    unit: 'mmHg',
    shortHelp: 'Systolic arterial blood pressure measured at rest in seated position.',
    rangeText: '80 – 200 mmHg',
    clinicalDefinition: 'The peak pressure exerted by circulating blood against arterial walls during ventricular contraction, measured at rest.',
    whyModelUsesIt: 'Chronic hypertension damages vascular endothelium, accelerates atherosclerotic plaque formation, and increases cardiac afterload.',
    categoriesOrValues: 'Numeric value in mmHg (systolic pressure).',
    normalReference: '< 120 mmHg (Normal), 120–129 mmHg (Elevated), 130–139 mmHg (Stage 1), ≥ 140 mmHg (Stage 2 Hypertension).'
  },
  Cholesterol: {
    name: 'Serum Cholesterol',
    unit: 'mg/dL',
    shortHelp: 'Total circulating serum cholesterol level.',
    rangeText: '100 – 600 mg/dL (or 0 for unrecorded baseline)',
    clinicalDefinition: 'Total quantity of lipid sterols transported in blood serum, including LDL, HDL, and VLDL fractions.',
    whyModelUsesIt: 'Elevated circulating cholesterol contributes directly to lipid-rich core atheroma deposition within coronary arterial walls.',
    categoriesOrValues: 'Numeric value in mg/dL. In the dataset, rare zero values are handled via median imputation.',
    normalReference: '< 200 mg/dL (Desirable), 200–239 mg/dL (Borderline High), ≥ 240 mg/dL (High).'
  },
  FastingBS: {
    name: 'Fasting Blood Sugar',
    unit: 'Threshold',
    shortHelp: 'Venous blood glucose level following an overnight fast (>8 hours).',
    rangeText: '0 (≤ 120 mg/dL) or 1 (> 120 mg/dL)',
    clinicalDefinition: 'Indicates whether overnight fasting plasma glucose exceeds the standard diagnostic threshold of 120 mg/dL.',
    whyModelUsesIt: 'Hyperglycemia promotes oxidative stress, accelerates vascular calcification, and is strongly correlated with metabolic syndrome.',
    categoriesOrValues: [
      { key: '0', label: 'Normal / Controlled (≤ 120 mg/dL)', desc: 'Fasting glucose within healthy or prediabetic reference boundaries.' },
      { key: '1', label: 'Elevated / Diabetic (> 120 mg/dL)', desc: 'Impaired fasting glucose indicative of insulin resistance or overt diabetes mellitus.' }
    ],
    normalReference: 'Fasting plasma glucose < 100 mg/dL is normal; threshold is 120 mg/dL in this clinical schema.'
  },
  RestingECG: {
    name: 'Resting Electrocardiogram',
    unit: 'Category',
    shortHelp: 'Baseline 12-lead electrical conduction tracing recorded at rest.',
    rangeText: 'Normal, ST, LVH',
    clinicalDefinition: 'Evaluation of cardiac electrical conduction, depolarization, and repolarization waves prior to stress testing.',
    whyModelUsesIt: 'Detects preexisting myocardial hypertrophy, chronic ischemia, or repolarization abnormalities.',
    categoriesOrValues: [
      { key: 'Normal', label: 'Normal Tracing', desc: 'No significant electrical conduction delays or ST-T repolarization anomalies.' },
      { key: 'ST', label: 'ST-T Wave Abnormality', desc: 'T-wave inversion or ST elevation/depression > 0.05 mV indicating resting ischemic burden.' },
      { key: 'LVH', label: 'Left Ventricular Hypertrophy (LVH)', desc: 'Meets Estes or Sokolow-Lyon electrical criteria for ventricular wall thickening.' }
    ],
    normalReference: 'Normal sinus rhythm without ischemic ST-T changes.'
  },
  MaxHR: {
    name: 'Maximum Heart Rate Achieved',
    unit: 'BPM',
    shortHelp: 'Peak ventricular rate documented during Bruce protocol exercise stress testing.',
    rangeText: '60 – 210 BPM',
    clinicalDefinition: 'The highest sustained heart rate recorded while exercising to voluntary exhaustion on a standardized treadmill.',
    whyModelUsesIt: 'Chronotropic incompetence (inability to reach expected target heart rate) strongly correlates with coronary disease and autonomic impairment.',
    categoriesOrValues: 'Numeric value in beats per minute (BPM). Reference formula: ~220 minus patient age.',
    normalReference: 'Expected target peak is approximately 85% of age-predicted maximum (220 - Age).'
  },
  ExerciseAngina: {
    name: 'Exercise-Induced Angina',
    unit: 'Presence',
    shortHelp: 'Whether physical exertion induced new or worsening chest discomfort.',
    rangeText: 'No (N) / Yes (Y)',
    clinicalDefinition: 'Occurrence of substernal discomfort or ischemic equivalent directly provoked by the physical demands of exercise.',
    whyModelUsesIt: 'A hallmark clinical sign of demand ischemia, where narrowed coronary vessels fail to supply adequate myocardial oxygen under stress.',
    categoriesOrValues: [
      { key: 'N', label: 'No (N)', desc: 'Exercise completed without inducing anginal symptoms.' },
      { key: 'Y', label: 'Yes (Y)', desc: 'Typical ischemic chest discomfort provoked during exertion.' }
    ],
    normalReference: 'Absence of exertional angina.'
  },
  Oldpeak: {
    name: 'ST Depression (Oldpeak)',
    unit: 'mm',
    shortHelp: 'Millimeters of ST-segment depression measured on post-exercise ECG.',
    rangeText: '-2.6 – 6.2 mm (Standard clinical: 0.0 – 4.0 mm)',
    clinicalDefinition: 'Horizontal or downsloping displacement of the ST segment relative to the PR segment baseline, recorded at 60–80 ms after the J-point.',
    whyModelUsesIt: 'Direct electrical hallmark of subendocardial ischemia induced by exercise stress.',
    categoriesOrValues: 'Numeric float (e.g. 0.0, 1.5, 2.8 mm). Higher values reflect more profound transmural or subendocardial ischemia.',
    normalReference: '< 1.0 mm ST depression is generally benign; ≥ 1.0 mm is clinically suspicious; ≥ 2.0 mm indicates marked ischemia.'
  },
  ST_Slope: {
    name: 'Peak Exercise ST Slope',
    unit: 'Trajectory',
    shortHelp: 'Geometric slope of the ST segment at peak exertion.',
    rangeText: 'Up, Flat, Down',
    clinicalDefinition: 'The trajectory of the ST segment as it transitions into the T wave at maximum cardiovascular workload.',
    whyModelUsesIt: 'The morphological slope trajectory differentiates benign physiological tachycardia from true coronary perfusion deficits.',
    categoriesOrValues: [
      { key: 'Up', label: 'Upsloping (Up)', desc: 'Rapid ascending ST segment; generally a normal physiological response to strenuous exertion.' },
      { key: 'Flat', label: 'Flat (Flat)', desc: 'Horizontal ST depression; strongly correlated with significant coronary stenosis.' },
      { key: 'Down', label: 'Downsloping (Down)', desc: 'Descending ST trajectory; associated with severe multivessel coronary disease and elevated risk.' }
    ],
    normalReference: 'Upsloping ST contour.'
  }
};
