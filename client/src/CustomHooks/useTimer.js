import { intervalToDuration, isBefore } from 'date-fns';
import { useEffect, useState } from 'react';

const useTimer = futureDate => {
	const [now, setNow] = useState(new Date());
	const isTimeUp = isBefore(futureDate , now)

	useEffect(() => {
		const interval = setInterval(() => {
			if(futureDate && !isTimeUp){
				setNow(new Date());
			}
			}, 1000);

			return () => {
				clearInterval(interval);
			}

	}, [futureDate]);

	if (isTimeUp) {
		return { days: 0, hours: 0, minutes: 0, seconds: 0 , isTimeUp};
	}

	let { days, hours, minutes, seconds } = intervalToDuration({
		start: now,
		end: futureDate,
	});
	return { days, hours, minutes, seconds , isTimeUp };
};

export default useTimer;
