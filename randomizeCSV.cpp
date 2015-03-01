#include <iostream>
#include <fstream>
#include <stdlib.h>
using namespace std;

int main () {
	ofstream myfile;
	myfile.open ("example.csv");
	long date = 140214220000;
	for (int i = 0; i < 7200; i++) {
		if (date%100<55)
			date+=5;
		else {
			date = (date/100)*100;
			if (date%10000 < 5900)
				date+=100;
			else {
				date = date/10000*10000;
				if (date%1000000 < 230000)
					date+=10000;
				else {
					date = date/1000000*1000000;
					date+=1000000;
				}
			}
		}
		myfile << date << '\t' << rand()%10 + 15 << '\t' << rand()%20 + 20 << '\t' << rand()%20 + 40 << '\t' << rand()%20 + 60 << '\t' << rand()%20 + 80 << '\n';
	}
	myfile.close();
	return 0;
}
