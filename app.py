
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

#Jobs list
jobs = [
    {
        "title": "Python Developer Intern",
        "company": "Tech Solutions",
        "skills": {"Python", "MySQL", "Git"}
    },
    {
        "title": "Java Developer Intern",
        "company": "CodeWorks",
        "skills": {"Java", "MySQL", "OOP"}
    },
    {
        "title": "Web Developer Intern",
        "company": "WebTech",
        "skills": {"HTML", "CSS", "JavaScript"}
    },
    {
        "title": "Data Analyst Intern",
        "company": "Data Insights",
        "skills": {"Python", "SQL", "Excel"}
    },
    {
        "title": "AI/ML Engineer Intern",
        "company": "AI Innovations",
        "skills": {"Python", "Machine Learning", "NumPy", "Pandas"}
    },
    {
        "title": "Data Scientist Intern",
        "company": "DataVision",
        "skills": {"Python", "Statistics", "Pandas", "SQL"}
    },
    {
        "title": "C++ Developer Intern",
        "company": "CodeCraft",
        "skills": {"C++", "DSA", "OOP"}
    },
    {
        "title": "Full Stack Developer Intern",
        "company": "WebSphere",
        "skills": {"HTML", "CSS", "JavaScript", "Python"}
    },
    {
        "title": "Database Administrator Intern",
        "company": "DB Solutions",
        "skills": {"MySQL", "SQL", "Database"}
    },
    {
        "title": "Software Engineer Intern",
        "company": "SoftTech",
        "skills": {"Java", "Python", "DSA", "Git"}
    },
    {
        "title": "Cybersecurity Intern",
        "company": "SecureNet",
        "skills": {"Linux", "Networking", "Python"}
    },
    {
        "title": "Cloud Engineer Intern",
        "company": "CloudWorks",
        "skills": {"AWS", "Linux", "Networking", "Python"}
    }
]



@app.route("/")
def home():
    return render_template("index.html")


@app.route("/match", methods=["POST"])
def match_jobs():
    data = request.get_json()

    # Convert student skills into a set
    student_skills = {
        skill.strip().title()
        for skill in data["skills"].split(",")
        if skill.strip()
    }

    results = []

    for job in jobs:

        required_skills = {
            skill.title()
            for skill in job["skills"]
        }

        # DMS: Set Intersection
        matched_skills = student_skills & required_skills

        # DMS: Set Difference
        missing_skills = required_skills - student_skills

        # Calculate match percentage
        percentage = (
            len(matched_skills) / len(required_skills)
        ) * 100

        results.append({
          "title": job["title"],
          "company": job["company"],

          # DMS Sets
          "student_skills": sorted(student_skills),
          "required_skills": sorted(required_skills),
          "matched": sorted(matched_skills),
          "missing": sorted(missing_skills),
          "percentage": round(percentage, 2)
        })

    # Sort jobs by highest matching percentage
    results.sort(
        key=lambda job: job["percentage"],
        reverse=True
    )

    return jsonify(results)


if __name__ == "__main__":
    app.run(debug=True)
