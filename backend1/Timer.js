class Timer {
    timeUpInterval = null;
    constructor(duration) {
        this.initialDuration = duration; // in milliseconds
        this.remainingTime = duration;
        this.interval = null;
        this.startTime = null;
        // this.timeUpInterval = null;
        this.flag = false;
    }

    start() {
        if (!this.startTime) {
            this.startTime = Date.now();
        } else {
            this.startTime = Date.now() - (this.initialDuration - this.remainingTime);
        }
        this.interval = setInterval(() => {
            const elapsedTime = Date.now() - this.startTime;
            this.remainingTime = this.initialDuration - elapsedTime;
            if (this.remainingTime <= 0) {
                clearInterval(this.interval);
                this.remainingTime = 0;
            }
        }, 100); // Update every 100 ms
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            this.initialDuration = this.remainingTime; // Save the remaining time
            this.startTime = null;
        }
    }

    reset() {
        this.stop();
        this.remainingTime = this.initialDuration;
    }

    getTime() {
        const minutes = Math.floor(this.remainingTime / (1000 * 60));
        const seconds = Math.floor((this.remainingTime % (1000 * 60)) / 1000);
        const milliseconds = this.remainingTime % 1000;
        return { minutes, seconds, milliseconds };
    }

    timeUp() {
        if (this.remainingTime > 0) {
            return false;
        } else {
            return true;
        }
    }


    checkTimeUp(callback) {
        const timeUpInterval = setInterval(() => {
            if (!this.remainingTime) {
                callback();
                clearInterval(timeUpInterval);
            }
        }, 100);
    }
}
module.exports = {
    Timer
};
