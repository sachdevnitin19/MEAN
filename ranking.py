import pymysql
import pymysql.cursors

score = [None] * 25


connection = pymysql.connect(host='nvrv.crgn93rhkeiy.ap-south-1.rds.amazonaws.com', user='admin',password='smartrecruiter', db='nvrv', charset='utf8mb4',cursorclass=pymysql.cursors.DictCursor)
conn = connection.cursor()

skillsreqd = input('Enter the skills for ranking')


for var in range(0,24):
    sql = "select skillsandexpertise from linkedin where id = %d" %(var+1)
    row = conn.execute(sql)
    row = conn.fetchall()
    row1 = str(row)
    print(row1)
    score1 = row1.count(skillsreqd)*10
    score[var] = score1
    print(var)


for var in range(0,24):
    sql = "select experience from linkedin where id = %d" %(var+1)
    row = conn.execute(sql)
    row = conn.fetchall()
    row1 = str(row)
    print(row1)
    score1 = row1.count(skillsreqd)*25
    score[var] = score[var] + score1
    print(var)


for var in range(0,24):
    sql = "select education from linkedin where id = %d" %(var+1)
    row = conn.execute(sql)
    row = conn.fetchall()
    row1 = str(row)
    print(row1)
    score1 = row1.count(skillsreqd)*15
    score[var] = score[var] + score1
    print(var)

for var in range(0,24):
    sql = "select courses from linkedin where id = %d" %(var+1)
    row = conn.execute(sql)
    row = conn.fetchall()
    row1 = str(row)
    print(row1)
    score1 = row1.count(skillsreqd)*10
    score[var] = score[var] + score1
    print(var)


for var in range(0,24):
    sql = "select certifications from linkedin where id = %d" %(var+1)
    row = conn.execute(sql)
    row = conn.fetchall()
    row1 = str(row)
    print(row1)
    score1 = row1.count(skillsreqd)*10
    score[var] = score[var] + score1
    print(var)

print(score)


