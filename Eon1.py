print(" 정수 n을 입력하시오.( n은 1보다 크거나 같으며, 9보다 작거나 같습니다.)")
num=int(input())

if num>=1 and num<=9 :
    for i in range(1,10):
        print("%d * %d = %d"%(num,i,num*i))

else :
    print(" 정수n 값을 확인해주세요.")
