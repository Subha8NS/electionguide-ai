/**
 * Voter Eligibility Logic
 */

export function calculateEligibility({ age, isCitizen, isRegistered }) {
  const numericAge = Number(age);
  
  if (isNaN(numericAge) || numericAge <= 0 || isCitizen === undefined) {
    return {
      status: 'pending',
      icon: '📝',
      title: 'Fill in your details',
      message: 'Please complete all fields with valid information to check your voting eligibility.'
    };
  }

  if (numericAge < 18) {
    const yearsLeft = 18 - numericAge;
    return {
      status: 'ineligible',
      icon: '🎂',
      title: 'Not Yet Eligible',
      message: `You need to be at least 18 years old to vote. You'll be eligible in ${yearsLeft} year${yearsLeft === 1 ? '' : 's'}! Start learning about the election process now so you're ready.`
    };
  }

  if (!isCitizen) {
    return {
      status: 'ineligible',
      icon: '🌍',
      title: 'Citizenship Required',
      message: 'Only citizens of the country are eligible to vote in national and state elections. Check local regulations for any exceptions.'
    };
  }

  if (!isRegistered) {
    return {
      status: 'pending',
      icon: '📋',
      title: 'Almost There!',
      message: 'You\'re eligible to vote! But you need to register first. Visit your local Election Commission office or register online at the National Voters\' Service Portal (NVSP).'
    };
  }

  return {
    status: 'eligible',
    icon: '✅',
    title: 'You\'re Eligible!',
    message: 'Great news! You meet all the requirements to vote. Make sure your voter ID is up to date and find your polling station before election day!'
  };
}
