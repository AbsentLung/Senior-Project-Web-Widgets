#include <iostream>
#include <fstream>
#include <stdlib.h>
#include <random>
#include <iomanip>
using namespace std;

int main () {
	ofstream myfile;
	myfile.open ("subjectTwo.csv");
	long date = 140214220000;
	double temp, light, sound, hr, rr;
	random_device rd;
	default_random_engine generator(rd());
	uniform_real_distribution<double> distributiontemp(22,24);
	uniform_real_distribution<double> distributionlight(300,340);
	uniform_real_distribution<double> distributionsound(28,37);
	uniform_real_distribution<double> distributionhr(60,62);
	uniform_real_distribution<double> distributionrr(22,24);
	uniform_real_distribution<double> distributionhr2(55,57);
	uniform_real_distribution<double> distributionrr2(22.8,23.2);
	uniform_real_distribution<double> distributionlight2(320,360);
	uniform_real_distribution<double> distributionlight3(340,380);
	uniform_real_distribution<double> distributionlight4(380,420);
	uniform_real_distribution<double> distributionlight5(400,440);
	for (int i = 0; i < 120; i++) {
		if (date%10000 < 5500)
			date+=500;
		else {
			date = date/10000*10000;
			if (date%1000000 < 230000)
				date+=10000;
			else {
				date = date/1000000*1000000;
				date+=1000000;
			}
		}
		if (date <= 140214230000) {
			temp = distributiontemp(generator);
			light =  distributionlight(generator);
			sound =  distributionsound(generator);
			hr =  distributionrr(generator);
			rr =  distributionhr(generator);
		}
		else if (date <= 140215003000) {
			temp = distributiontemp(generator);
			light =  distributionlight(generator);
			sound =  distributionsound(generator);
			hr =  distributionrr2(generator);
			rr =  distributionhr2(generator);
		}
		else if (date <= 140215020000) {
			temp = distributiontemp(generator);
			light =  distributionlight(generator);
			sound =  distributionsound(generator);
			hr =  distributionrr(generator);
			rr =  distributionhr(generator);
		}
		else if (date <= 140215023000) {
			temp = distributiontemp(generator);
			light =  distributionlight(generator);
			sound =  distributionsound(generator);
			hr =  distributionrr2(generator);
			rr =  distributionhr2(generator);
		}
		else if (date <= 140215030000) {
			temp = distributiontemp(generator);
			light =  distributionlight(generator);
			sound =  distributionsound(generator);
			hr =  distributionrr(generator);
			rr =  distributionhr(generator);
		}
		else if (date <= 140215033000) {
			temp = distributiontemp(generator);
			light =  distributionlight(generator);
			sound =  distributionsound(generator);
			hr =  distributionrr2(generator);
			rr =  distributionhr2(generator);
		}
		else if (date <= 140215040000) {
			temp = distributiontemp(generator);
			light =  distributionlight(generator);
			sound =  distributionsound(generator);
			hr =  distributionrr(generator);
			rr =  distributionhr(generator);
		}
		else if (date <= 140215043000) {
			temp = distributiontemp(generator);
			light =  distributionlight(generator);
			sound =  distributionsound(generator);
			hr =  distributionrr2(generator);
			rr =  distributionhr2(generator);
		}
		else if (date <= 140215050000) {
			temp = distributiontemp(generator);
			light =  distributionlight(generator);
			sound =  distributionsound(generator);
			hr =  distributionrr(generator);
			rr =  distributionhr(generator);
		}
		else if (date <= 140215053000) {
			temp = distributiontemp(generator);
			light =  distributionlight(generator);
			sound =  distributionsound(generator);
			hr =  distributionrr2(generator);
			rr =  distributionhr2(generator);
		}
		else if (date <= 140215063000) {
			temp = distributiontemp(generator);
			light =  distributionlight2(generator);
			sound =  distributionsound(generator);
			hr =  distributionrr(generator);
			rr =  distributionhr(generator);
		}
		else if (date <= 140215073000) {
			temp = distributiontemp(generator);
			light =  distributionlight3(generator);
			sound =  distributionsound(generator);
			hr =  distributionrr(generator);
			rr =  distributionhr(generator);
		}
		else if (date <= 140215073000) {
			temp = distributiontemp(generator);
			light =  distributionlight4(generator);
			sound =  distributionsound(generator);
			hr =  distributionrr(generator);
			rr =  distributionhr(generator);
		}
		else {
			temp = distributiontemp(generator);
			light =  distributionlight5(generator);
			sound =  distributionsound(generator);
			hr =  distributionrr(generator);
			rr =  distributionhr(generator);
		}
		myfile << fixed << setprecision(2) << date << ',' << temp << ',' << light << ',' << sound << ',' << rr << ',' << hr << '\n';
	}
	myfile.close();
	return 0;
}
